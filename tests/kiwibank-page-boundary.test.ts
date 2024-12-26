import { describe, test } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { KiwibankPageBoundaryZ } from '../src/types/kiwibank-page-boundary.ts'

const pageBoundaryRows = [
  [
    'ST 8190 050718',
    'Page 3 of 8 (Please turn over)',
    '',
    'Date',
    ' ',
    'Transaction',
    ' ',
    'Withdrawals',
    ' ',
    'Deposits',
    ' ',
    'Balance',
    '',
  ],
  [
    'ST 8190 050718',
    'Page 4 of 8',
    '',
    'Date',
    ' ',
    'Transaction',
    ' ',
    'Withdrawals',
    ' ',
    'Deposits',
    ' ',
    'Balance',
    '',
  ],
  [
    'ST 8190 050718',
    'Page 5 of 8 (Please turn over)',
    '',
    'Date',
    ' ',
    'Transaction',
    ' ',
    'Withdrawals',
    ' ',
    'Deposits',
    ' ',
    'Balance',
    '',
  ],
  [
    'ST 8190 050718',
    'Page 6 of 8',
    '',
    'Date',
    ' ',
    'Transaction',
    ' ',
    'Withdrawals',
    ' ',
    'Deposits',
    ' ',
    'Balance',
    '',
  ],
  [
    'ST 8190 050718',
    'Page 7 of 8 (Please turn over)',
    '',
    'Date',
    ' ',
    'Transaction',
    ' ',
    'Withdrawals',
    ' ',
    'Deposits',
    ' ',
    'Balance',
    '',
  ],
]
describe('Kiwibank page boundary', () => {
  for (const row of pageBoundaryRows) {
    test(`'${row} is successfully identified as a page boundary row.`, () => {
      expect(KiwibankPageBoundaryZ.safeParse(row).success).toEqual(true)
    })
  }
})
