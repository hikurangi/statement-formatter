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
        'DINGLESCOFFEERETAILCONSCHEESE',
        'LAND',
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
    const previousBalance = 1808.9
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
        previousBalance,
        accountNumber: ACCOUNT_NUMBER,
        year: YEAR,
      },
      singleRow,
      []
    )
    expect(actual).toEqual(expected)
  })

  test('formats a single regular credit row correctly', () => {
    const previousBalance = 1803.84
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
        previousBalance,
        accountNumber: ACCOUNT_NUMBER,
        year: YEAR,
      },
      singleRow,
      []
    )
    expect(actual).toEqual(expected)
  })

  test('formats a concertina row', () => {
    const previousBalance = 262685.77
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
        previousBalance,
        accountNumber: ACCOUNT_NUMBER,
        year: YEAR,
      },
      concertinaRow,
      []
    )
    expect(actual).toEqual(expected)
  })

  test('formats a group of rows correctly, including a gnarly multiline one bith both concertina description text AND metadata row text', () => {
    const previousBalance = 3716.11
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
        'DINGLESCOFFEERETAILCONSCHEESE',
        'LAND',
        '$11.50',
        ' ',
        '$3,200.86',
      ],
      [
        '13 Apr',
        ' ',
        'BIGGER RAGLAN CHEESELAND',
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
        'Memo/Description': 'DINGLESCOFFEERETAILCONSCHEESE ;LAND ;',
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
        'Memo/Description': 'BIGGER RAGLAN CHEESELAND ;',
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
        previousBalance,
        accountNumber: ACCOUNT_NUMBER,
        year: YEAR,
      },
      gnarlyMultiLineSection,
      []
    )
    expect(actual).toEqual(expected)
  })

  test('formats rows with a mix of credits and debits', () => {
    const mixedRows = [
      [
        '15 Mar',
        ' ',
        'AP#19435003 TO X F DOODLEBLIP',
        ' ',
        '$70.00',
        ' ',
        '$915.87',
      ],
      ['15 Mar', ' ', 'Pay X F DOODLEBLIP', ' ', 'PERIODIC PAY'],
      ['15 Mar', ' ', 'Expenses Wilson St Hikurangi', ' ', 'PERIODIC PAY'],
      ['15 Mar', ' ', 'SANDALS CHEESELAND', ' ', '$17.80', ' ', '$898.07'],
      [
        '15 Mar',
        ' ',
        'Direct Credit Mono Limited',
        ' ',
        '$64.56',
        ' ',
        '$962.63',
      ],
      ['15 Mar', ' ', 'Ref: Mono Expense'],
      [
        '15 Mar',
        ' ',
        'Direct Credit Mono Limited',
        ' ',
        '$69.07',
        ' ',
        '$1,031.70',
      ],
      ['15 Mar', ' ', 'Ref: Mono Expense'],
      [
        '15 Mar',
        ' ',
        'Direct Credit Mono Limited',
        ' ',
        '$68.36',
        ' ',
        '$1,100.06',
      ],
      ['15 Mar', ' ', 'Ref: Mono Expense'],
      [
        '15 Mar',
        ' ',
        'Direct Credit Mono Limited',
        ' ',
        '$336.23',
        ' ',
        '$1,436.29',
      ],
      ['15 Mar', ' ', 'Ref: Mono Expense'],
      [
        '15 Mar',
        ' ',
        'Direct Credit Mono Limited',
        ' ',
        '$66.03',
        ' ',
        '$1,502.32',
      ],
      ['15 Mar', ' ', 'Ref: Mono Expense'],
      [
        '15 Mar',
        ' ',
        'Direct Credit Mono Limited',
        ' ',
        '$930.47',
        ' ',
        '$2,432.79',
      ],
      ['15 Mar', ' ', 'Ref: Mono Expense'],
      [
        '15 Mar',
        ' ',
        'Bill Payment ROSEN M X',
        ' ',
        '$243.00',
        ' ',
        '$2,675.79',
      ],
      ['15 Mar', ' ', 'YUMS SUSHI CHEESELAND', ' ', '$14.70', ' ', '$2,661.09'],
    ]
    const expected: Array<KiwibankCSVRowT> = [
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '15 Mar 2022',
        'Memo/Description':
          'AP#19435003 TO X F DOODLEBLIP ;Pay X F DOODLEBLIP ;Expenses Wilson St Hikurangi ;',
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
        'Amount(debit)': 70,
        Amount: -70,
        Balance: 915.87,
      },
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '15 Mar 2022',
        'Memo/Description': 'SANDALS CHEESELAND ;',
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
        'Amount(debit)': 17.8,
        Amount: -17.8,
        Balance: 898.07,
      },
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '15 Mar 2022',
        'Memo/Description': 'Direct Credit Mono Limited ;Ref: Mono Expense ;',
        'Source Code(payment type)': '',
        'TP ref': '',
        'TP part': '',
        'TP code': '',
        'OP ref': '',
        'OP part': '',
        'OP code': '',
        'OP name': '',
        'OP Bank Account Number': '',
        'Amount(credit)': 64.56,
        'Amount(debit)': 0,
        Amount: 64.56,
        Balance: 962.63,
      },
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '15 Mar 2022',
        'Memo/Description': 'Direct Credit Mono Limited ;Ref: Mono Expense ;',
        'Source Code(payment type)': '',
        'TP ref': '',
        'TP part': '',
        'TP code': '',
        'OP ref': '',
        'OP part': '',
        'OP code': '',
        'OP name': '',
        'OP Bank Account Number': '',
        'Amount(credit)': 69.07,
        'Amount(debit)': 0,
        Amount: 69.07,
        Balance: 1031.7,
      },
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '15 Mar 2022',
        'Memo/Description': 'Direct Credit Mono Limited ;Ref: Mono Expense ;',
        'Source Code(payment type)': '',
        'TP ref': '',
        'TP part': '',
        'TP code': '',
        'OP ref': '',
        'OP part': '',
        'OP code': '',
        'OP name': '',
        'OP Bank Account Number': '',
        'Amount(credit)': 68.36,
        'Amount(debit)': 0,
        Amount: 68.36,
        Balance: 1100.06,
      },
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '15 Mar 2022',
        'Memo/Description': 'Direct Credit Mono Limited ;Ref: Mono Expense ;',
        'Source Code(payment type)': '',
        'TP ref': '',
        'TP part': '',
        'TP code': '',
        'OP ref': '',
        'OP part': '',
        'OP code': '',
        'OP name': '',
        'OP Bank Account Number': '',
        'Amount(credit)': 336.23,
        'Amount(debit)': 0,
        Amount: 336.23,
        Balance: 1436.29,
      },
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '15 Mar 2022',
        'Memo/Description': 'Direct Credit Mono Limited ;Ref: Mono Expense ;',
        'Source Code(payment type)': '',
        'TP ref': '',
        'TP part': '',
        'TP code': '',
        'OP ref': '',
        'OP part': '',
        'OP code': '',
        'OP name': '',
        'OP Bank Account Number': '',
        'Amount(credit)': 66.03,
        'Amount(debit)': 0,
        Amount: 66.03,
        Balance: 1502.32,
      },
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '15 Mar 2022',
        'Memo/Description': 'Direct Credit Mono Limited ;Ref: Mono Expense ;',
        'Source Code(payment type)': '',
        'TP ref': '',
        'TP part': '',
        'TP code': '',
        'OP ref': '',
        'OP part': '',
        'OP code': '',
        'OP name': '',
        'OP Bank Account Number': '',
        'Amount(credit)': 930.47,
        'Amount(debit)': 0,
        Amount: 930.47,
        Balance: 2432.79,
      },
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '15 Mar 2022',
        'Memo/Description': 'Bill Payment ROSEN M X ;',
        'Source Code(payment type)': '',
        'TP ref': '',
        'TP part': '',
        'TP code': '',
        'OP ref': '',
        'OP part': '',
        'OP code': '',
        'OP name': '',
        'OP Bank Account Number': '',
        'Amount(credit)': 243,
        'Amount(debit)': 0,
        Amount: 243,
        Balance: 2675.79,
      },
      {
        'Account number': ACCOUNT_NUMBER,
        Date: '15 Mar 2022',
        'Memo/Description': 'YUMS SUSHI CHEESELAND ;',
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
        'Amount(debit)': 14.7,
        Amount: -14.7,
        Balance: 2661.09,
      },
    ]

    const actual = formatRows(
      {
        accountNumber: ACCOUNT_NUMBER,
        previousBalance: 985.87,
        year: '2022',
      },
      mixedRows,
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
