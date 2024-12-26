import {
  concat,
  curry,
  endsWith,
  filter,
  flip,
  flow,
  join,
  nth,
  slice,
  trim,
} from 'npm:ramda'
import unformatCurrencyAsNumber from './unformat-currency-as-number.ts'
import { KiwibankCSVRowT } from '../types/kiwibank-csv-row.ts'
import { MapRowConfig } from '../types/config.ts'
import { EmptyStringOrSpaceZ } from '../types/shared.ts'

const concatBefore = flip(concat)

const mapRow = curry(
  (
    {
      accountNumber,
      year,
      previousBalance,
      metaDescription = [],
    }: MapRowConfig,
    row: Array<string>
  ): KiwibankCSVRowT => {
    const amount = unformatCurrencyAsNumber(nth(-3, row) || '')
    const currentBalance = unformatCurrencyAsNumber(nth(-1, row) || '')
    const isCredit =
      (previousBalance + amount).toFixed(2) === currentBalance.toFixed(2)
    const formattedDate = `${row[0]} ${year}`

    const description = flow(row, [
      slice(2, -3),
      concatBefore(metaDescription),
      filter(
        (item: unknown) => EmptyStringOrSpaceZ.safeParse(item).success === false
      ),
      join(' ;'),
      trim,
      // the function below just lets us consistently match Kiwibank's (bad) formatting.
      (str: string) => concat(str, ' ;'),
    ])

    return {
      'Account number': accountNumber,
      Date: formattedDate,
      'Memo/Description': description,
      'Source Code(payment type)': '',
      'TP ref': '',
      'TP part': '',
      'TP code': '',
      'OP ref': '',
      'OP part': '',
      'OP code': '',
      'OP name': '',
      'OP Bank Account Number': '',
      'Amount(credit)': isCredit ? amount : 0,
      'Amount(debit)': !isCredit ? amount : 0,
      Amount: isCredit ? amount : -amount,
      Balance: currentBalance,
    }
  }
)

export default mapRow
