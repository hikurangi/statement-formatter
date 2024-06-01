import { KiwibankCSVRowT } from '../types/kiwibank-csv-row'
import unformatCurrencyAsNumber from './unformat-currency-as-number'

const formatRows =
  (accountNumber: string) =>
  (rows: Array<Array<string>>): Array<KiwibankCSVRowT> =>
    rows.map(row => {
      const creditAmount = unformatCurrencyAsNumber(row[3])
      const debitAmount = unformatCurrencyAsNumber(row[4])
      const signedAmount =
        debitAmount > creditAmount ? -debitAmount : creditAmount

      return {
        'Account number': accountNumber,
        Date: row[0],
        'Memo/Description': row[2],
        'Source Code(payment type)': '',
        'TP ref': '',
        'TP part': '',
        'TP code': '',
        'OP ref': '',
        'OP part': '',
        'OP code': '',
        'OP name': '',
        'OP Bank Account Number': '',
        'Amount(credit)': creditAmount,
        'Amount(debit)': debitAmount,
        Amount: signedAmount,
        Balance: unformatCurrencyAsNumber(row[6]),
      }
    })

export default formatRows
