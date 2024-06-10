import { chain } from 'ramda'
import { cleanMetadataRow, formatRows } from '../src/lib/format-rows'
import { KiwibankCSVRowT } from '../src/types/kiwibank-csv-row'
import { isStandardKiwibankPDFRow } from '../src/types/shared'

const ACCOUNT_NUMBER = '98-7654-3211010-01'
const YEAR = '2022'

describe('Kiwibank standard row type guard', () => {
  test.each([
    [
      [
        '13 Apr',
        ' ',
        'DINGLESCOFFEERETAILCONSWELLIN',
        'GTON',
        '$11.50',
        ' ',
        '$3,200.86',
      ],
    ],
    [
      [
        '26 Mar',
        ' ',
        'PARKING LORDS INC., JOHNSONVILLE',
        ' ',
        '$4.25',
        ' ',
        '$1,803.84',
      ],
    ],
  ])("correctly identifies '%s' as a standard Kiwibank PDF row", row => {
    expect(isStandardKiwibankPDFRow(row)).toEqual(true)
  })

  test.each([
    [['13 Apr', ' ', 'Home Loan', ' ', 'PERIODIC PAY']],
    [
      [
        '13 Apr',
        ' ',
        'Transfer to A B C D E F G',
        'AJDIMMMLIKNULD, F G BLOUNT, M',
        'PERIODIC PAY',
      ],
    ],
  ])(
    "correctly identifies '%s' as *not* being a standard Kiwibank PDF row",
    row => {
      expect(isStandardKiwibankPDFRow(row)).toEqual(false)
    }
  )
})

describe('Row formatter function', () => {
  test('formats a single regular debit row correctly', () => {
    const startingBalance = 1808.9
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
        'Account number': ACCOUNT_NUMBER,
        Date: '26 Mar 2022',
        'Memo/Description': 'PARKING LORDS INC., JOHNSONVILLE ;',
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
    const actual = formatRows(
      {
        startingBalance,
        accountNumber: ACCOUNT_NUMBER,
        year: YEAR,
      },
      singleRow,
      []
    )
    expect(actual).toEqual(expected)
  })

  test('formats a single regular credit row correctly', () => {
    const startingBalance = 1803.84
    const singleRow = [
      [
        '26 Mar',
        ' ',
        'PARKING LORDS INC., JOHNSONVILLE REFUND',
        ' ',
        '$1,000,000.00',
        ' ',
        '$1,001,803.84',
      ],
    ]
    const expected: Array<KiwibankCSVRowT> = [
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '26 Mar 2022',
        'Memo/Description': 'PARKING LORDS INC., JOHNSONVILLE REFUND ;',
        'Source Code(payment type)': '',
        'TP ref': '',
        'TP part': '',
        'TP code': '',
        'OP ref': '',
        'OP part': '',
        'OP code': '',
        'OP name': '',
        'OP Bank Account Number': '',
        'Amount(credit)': 1000000,
        'Amount(debit)': 0,
        Amount: 1000000,
        Balance: 1001803.84,
      },
    ]
    const actual = formatRows(
      {
        startingBalance,
        accountNumber: ACCOUNT_NUMBER,
        year: YEAR,
      },
      singleRow,
      []
    )
    expect(actual).toEqual(expected)
  })

  test('formats a concertina row', () => {
    const startingBalance = 262685.77
    const concertinaRow = [
      [
        '31 Mar',
        ' ',
        'TRANSFER TO A B C D E F G',
        'AJDIMMMLIKNULD, F G BLOUNT, M X',
        'ROSEN, J J DONNELT, U V ROWLAND -',
        '06',
        '$252,661.77',
        ' ',
        '$10,024.00',
      ],
    ]
    const expected: Array<KiwibankCSVRowT> = [
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '31 Mar 2022',
        'Memo/Description':
          'TRANSFER TO A B C D E F G ;AJDIMMMLIKNULD, F G BLOUNT, M X ;ROSEN, J J DONNELT, U V ROWLAND - ;06 ;',
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
        'Amount(debit)': 252661.77,
        Amount: -252661.77,
        Balance: 10024.0,
      },
    ]

    const actual = formatRows(
      {
        startingBalance,
        accountNumber: ACCOUNT_NUMBER,
        year: YEAR,
      },
      concertinaRow,
      []
    )
    expect(actual).toEqual(expected)
  })

  test('formats a group of rows correctly, including a gnarly multiline one bith both concertina description text AND metadata row text', () => {
    const startingBalance = 3716.11
    const gnarlyMultiLineSection = [
      ['12 Apr', ' ', 'TRF 4327********2015', ' ', '$2.00', ' ', '$3,714.11'],
      [
        '12 Apr',
        ' ',
        'PARKING LORDS INC., JOHNSONVILLE',
        ' ',
        '$1.75',
        ' ',
        '$3,712.36',
      ],
      [
        '13 Apr',
        ' ',
        'AP#20174061 TO A B C D E F G',
        'AJDIMMMLIKNULD, F G BLOUNT, M X',
        'ROSEN, J J DONNELT, U V ROWLAND',
        '$500.00',
        ' ',
        '$3,212.36',
      ],
      [
        '13 Apr',
        ' ',
        'Transfer to A B C D E F G',
        'AJDIMMMLIKNULD, F G BLOUNT, M',
        'PERIODIC PAY',
      ],
      [
        '13 Apr',
        ' ',
        'X ROSEN, J J DONNELT, U V ROWLAND',
        '- 06',
        'PERIODIC PAY',
      ],
      ['13 Apr', ' ', 'Home Loan', ' ', 'PERIODIC PAY'],
      [
        '13 Apr',
        ' ',
        'DINGLESCOFFEERETAILCONSWELLIN',
        'GTON',
        '$11.50',
        ' ',
        '$3,200.86',
      ],
      [
        '13 Apr',
        ' ',
        'BIGGER RAGLAN WELLINGTON',
        ' ',
        '$21.00',
        ' ',
        '$3,179.86',
      ],
    ]
    const expected: Array<KiwibankCSVRowT> = [
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '12 Apr 2022',
        'Memo/Description': 'TRF 4327********2015 ;',
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
        'Amount(debit)': 2.0,
        Amount: -2.0,
        Balance: 3714.11,
      },
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '12 Apr 2022',
        'Memo/Description': 'PARKING LORDS INC., JOHNSONVILLE ;',
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
        'Amount(debit)': 1.75,
        Amount: -1.75,
        Balance: 3712.36,
      },
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '13 Apr 2022',
        'Memo/Description':
          'AP#20174061 TO A B C D E F G ;AJDIMMMLIKNULD, F G BLOUNT, M X ;ROSEN, J J DONNELT, U V ROWLAND ;Transfer to A B C D E F G ;AJDIMMMLIKNULD, F G BLOUNT, M ;X ROSEN, J J DONNELT, U V ROWLAND ;- 06 ;Home Loan ;',
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
        'Amount(debit)': 500.0,
        Amount: -500.0,
        Balance: 3212.36,
      },
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '13 Apr 2022',
        'Memo/Description': 'DINGLESCOFFEERETAILCONSWELLIN ;GTON ;',
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
        'Amount(debit)': 11.5,
        Amount: -11.5,
        Balance: 3200.86,
      },
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '13 Apr 2022',
        'Memo/Description': 'BIGGER RAGLAN WELLINGTON ;',
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
        'Amount(debit)': 21.0,
        Amount: -21.0,
        Balance: 3179.86,
      },
    ]
    const actual = formatRows(
      {
        startingBalance,
        accountNumber: ACCOUNT_NUMBER,
        year: YEAR,
      },
      gnarlyMultiLineSection,
      []
    )
    expect(actual).toEqual(expected)
  })
})

describe('Metadata collector', () => {
  test('collects metadata correctly', () => {
    const metadataRows = [
      [
        '13 Apr',
        ' ',
        'Transfer to A B C D E F G',
        'AJDIMMMLIKNULD, F G BLOUNT, M',
        'PERIODIC PAY',
      ],
      [
        '13 Apr',
        ' ',
        'X ROSEN, J J DONNELT, U V ROWLAND',
        '- 06',
        'PERIODIC PAY',
      ],
      ['13 Apr', ' ', 'Home Loan', ' ', 'PERIODIC PAY'],
    ]
    const expected = [
      'Transfer to A B C D E F G',
      'AJDIMMMLIKNULD, F G BLOUNT, M',
      'X ROSEN, J J DONNELT, U V ROWLAND',
      '- 06',
      'Home Loan',
    ]
    const actual = chain(cleanMetadataRow, metadataRows)
    expect(actual).toEqual(expected)
  })
})
