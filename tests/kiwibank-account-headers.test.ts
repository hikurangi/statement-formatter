import { KIWIBANK_ACCOUNT_HEADER_DATE_RANGE_FORMAT } from '../src/lib/kiwibank-date-format-regex'
import { KiwibankAccountHeaderZ } from '../src/types/kiwibank-account-headers'

describe('Kiwibank account header date range regex', () => {
  test.each([
    '15 March 2022 to 14 April 2022',
    '27 July 1995 to 11 November 2123',
  ])("'%s' is recognised as a date range", value => {
    expect(KIWIBANK_ACCOUNT_HEADER_DATE_RANGE_FORMAT.test(value)).toEqual(true)
  })
})

describe('Kiwibank account headers and data identifier', () => {
  test.each([
    [
      [
        'Account Name:',
        ' ',
        'DINGALING Q. BOGLEDORFF',
        '',
        'Product Name:',
        ' ',
        'Free Up Account',
        '',
        'Personalised Name:',
        ' ',
        'Everyday',
        '',
        'Account Number:',
        ' ',
        '99-4567-0802993-00',
        '',
        'Statement Period:',
        ' ',
        '15 March 2022 to 14 April 2022',
      ],
    ],
    [
      [
        'Account Name:',
        ' ',
        'DINGALING Q. BOGLEDORFF',
        '',
        'Product Name:',
        ' ',
        'Back-Up Saver Account',
        '',
        'Personalised Name:',
        ' ',
        'Tax',
        '',
        'Account Number:',
        ' ',
        '99-4567-0802993-01',
        '',
        'Statement Period:',
        ' ',
        '15 March 2022 to 14 April 2022',
      ],
    ],
    [
      [
        'Account Name:',
        ' ',
        'DINGALING Q. BOGLEDORFF',
        '',
        'Product Name:',
        ' ',
        'Back-Up Saver Account',
        '',
        'Personalised Name:',
        ' ',
        'Large Expenses',
        '',
        'Account Number:',
        ' ',
        '99-4567-0802993-03',
        '',
        'Statement Period:',
        ' ',
        '15 March 2022 to 14 April 2022',
      ],
    ],
  ])(
    "'%s' is correctly identified as a set of account headers and data",
    window => {
      expect(KiwibankAccountHeaderZ.safeParse(window).success).toEqual(true)
    }
  )
})
