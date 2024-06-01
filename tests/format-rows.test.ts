import formatRows from '../src/lib/format-rows'
import { KiwibankCSVRowT } from '../src/types/kiwibank-csv-row'

test('Formats a single regular row correctly', () => {
  const accountNumber = '98-7654-3211010-01'

  const singleRow = [
    [
      '26 Mar',
      ' ',
      'PARKING LORDS INC., JOHNSONVILLE',
      ' ',
      '$4.25',
      ' ',
      '$1,803.84',
    ],
  ]
  const expected: Array<KiwibankCSVRowT> = [
    {
      'Account number': accountNumber,
      Date: '26 Mar',
      'Memo/Description': 'PARKING LORDS INC., JOHNSONVILLE',
      'Source Code(payment type)': '',
      'TP ref': '',
      'TP part': '',
      'TP code': '',
      'OP ref': '',
      'OP part': '',
      'OP code': '',
      'OP name': '',
      'OP Bank Account Number': '',
      'Amount(credit)': 0,
      'Amount(debit)': 4.25,
      Amount: -4.25,
      Balance: 1803.84,
    },
  ]
  const actual = formatRows(accountNumber)(singleRow)
  expect(actual).toEqual(expected)
})
