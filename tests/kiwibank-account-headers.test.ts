import { describe, test } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'

import { KIWIBANK_ACCOUNT_HEADER_DATE_RANGE_FORMAT } from '../src/lib/kiwibank-date-format-regex.ts'
import { KiwibankAccountHeaderZ } from '../src/types/kiwibank-account-headers.ts'

describe('Kiwibank account header date range regex', () => {
  for (const testCase of [
    '15 March 2022 to 14 April 2022',
    '27 July 1995 to 11 November 2123',
  ]) {
    test(`'${testCase}' is recognised as a date range`, () => {
      expect(KIWIBANK_ACCOUNT_HEADER_DATE_RANGE_FORMAT.test(testCase)).toEqual(
        true
      )
    })
  }
})

describe('Kiwibank account headers and data identifier', () => {
  for (const testCase of [
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
  ]) {
    test(`'${testCase}' is correctly identified as a set of account headers and data`, () => {
      const parseResult = KiwibankAccountHeaderZ.safeParse(testCase)
      const actual = parseResult.success
      expect(actual).toEqual(true)
    })
  }
})
