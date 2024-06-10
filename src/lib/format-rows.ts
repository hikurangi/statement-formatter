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
  last,
  pipe,
  slice,
  tail,
  takeWhile,
} from 'ramda'
import { KiwibankCSVRowT } from '../types/kiwibank-csv-row.js'
import { FormatRowsConfig } from '../types/config.js'
import mapRow from './map-row.js'
import { isStandardKiwibankPDFRow } from '../types/shared.js'
import unformatCurrencyAsNumber from './unformat-currency-as-number.js'

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
    remainingRows: Array<Array<string>>,
    // For currying functionality, this last parameter can't be optional...
    // ...'cause it frigs with the arity. This makes the API less nice.
    acc: Array<KiwibankCSVRowT>
  ): Array<KiwibankCSVRowT> => {
    const { accountNumber, previousBalance, year } = config
    if (remainingRows.length === 0) {
      return acc
    }

    // see base case above. head must exist.
    const currentRow = head(remainingRows)!
    const currentBalance = unformatCurrencyAsNumber(last(currentRow) || '')
    if (!isStandardKiwibankPDFRow(currentRow)) {
      // NOTE: this branch should be impossible, we eliminate non-standard rows before we get here
      // but we sure wanna know if it's being hit
      console.error(
        '\n😵 with this row, we have achieved the impossible 😵\n',
        { currentRow }
      )
    }

    const subsequentRows = tail(remainingRows)
    const nextRow = head(subsequentRows)

    // if we're on the last item OR
    // the next item is a standard row
    // we can just add the current mapped row to the pile
    // since we know the current row is a 'standard' row
    if (isStandardKiwibankPDFRow(nextRow) || subsequentRows.length === 0) {
      return flow(currentRow, [
        mapRow({
          accountNumber,
          year,
          previousBalance,
        }),
        flippedAppend(acc),
        formatRows(
          { ...config, previousBalance: currentBalance },
          subsequentRows
        ),
      ])
    } else {
      // if row is standard and followed by ABNORMAL rows
      // (NOTE: this doesn't take into account non-standard rows which are the ends of pages, ends of statements etc...)
      const currentRowMetadata = takeWhile(
        row => !isStandardKiwibankPDFRow(row),
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
          currentRow,
          currentRowMetadata,
        })
        console.error("\n🙄 tfw metadata rows date doesn't match 🙄\n")
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
          previousBalance,
          metaDescription: chain(cleanMetadataRow, currentRowMetadata),
        }),
        flippedAppend(acc),
        formatRows(
          { ...config, previousBalance: currentBalance },
          rowsFromNextStandardRow
        ),
      ])
    }
  }
)
