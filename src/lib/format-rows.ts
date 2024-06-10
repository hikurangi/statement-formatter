import {
  all,
  append,
  chain,
  curry,
  filter,
  flip,
  flow,
  head,
  includes,
  not,
  pipe,
  slice,
  tail,
  takeWhile,
} from 'ramda'
import { KiwibankCSVRowT } from '../types/kiwibank-csv-row.js'
import { FormatRowsConfig } from '../types/config.js'
import mapRow from './map-row.js'
import { isStandardKiwibankRow } from '../types/shared.js'

// Helpers
const flippedAppend = flip(append)

export const cleanMetadataRow = pipe<
  Array<Array<string>>, // type of supplied arguments
  Array<string>, // result of fn 1
  Array<string> // result of fn 2
>(
  slice(2, Infinity),
  filter(cell => includes(cell, [' ', 'PERIODIC PAY']) === false)
)

export const formatRows = curry(
  (
    config: FormatRowsConfig,
    rows: Array<Array<string>>,
    // For currying functionality, this last parameter can't be optional...
    // ...'cause it frigs with the arity. This makes the API less nice.
    acc: Array<KiwibankCSVRowT>
  ): Array<KiwibankCSVRowT> => {
    const { accountNumber, startingBalance, year } = config
    if (rows.length === 0) {
      return acc
    }

    // see base case above. head must exist.
    const currentRow = head(rows)!
    if (!isStandardKiwibankRow(currentRow)) {
      // NOTE: this branch should be impossible, we eliminate non-standard rows before we get here
      // but we sure wanna know if it's being hit
      console.error(
        '\n😵 with this row, we have achieved the impossible 😵\n',
        { currentRow }
      )
    }

    const subsequentRows = tail(rows)
    const nextRow = head(subsequentRows)

    // if we're on the last item OR
    // the next item is a standard row
    // we can just add the current mapped row to the pile
    // since we know the current row is a 'standard' row
    if (isStandardKiwibankRow(nextRow) || subsequentRows.length === 0) {
      return flow(currentRow, [
        mapRow({
          accountNumber,
          year,
          startingBalance,
        }),
        flippedAppend(acc),
        formatRows(config, subsequentRows),
      ])
    } else {
      // if row is standard and followed by ABNORMAL rows
      // (NOTE: this doesn't take into account non-standard rows which are the ends of pages, ends of statements etc...)
      const currentRowMetadata = takeWhile(
        pipe(isStandardKiwibankRow, not),
        subsequentRows
      )

      if (
        // Can also get confirmation by checking that the 'metadata rows' also have the same date as the real row. The date is always in position '0'
        !all(
          metadataRow => metadataRow[0] === currentRow[0],
          currentRowMetadata
        )
      ) {
        console.error("\n🙄 tfw metadata rows date doesn't match 🙄\n", {
          currentRowMetadata,
        })
      }

      const rowsFromNextStandardRow = slice(
        currentRowMetadata.length,
        Infinity,
        subsequentRows
      )

      return flow(currentRow, [
        mapRow({
          accountNumber,
          year,
          startingBalance,
          metaDescription: chain(cleanMetadataRow, currentRowMetadata),
        }),
        flippedAppend(acc),
        formatRows(config, rowsFromNextStandardRow),
      ])
    }
  }
)
