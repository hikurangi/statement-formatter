import { KiwibankPageBoundaryZ } from '../src/types/kiwibank-page-boundary'

describe('Kiwibank page boundary', () => {
  test.each([
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
  ])("'%s' is identified successfully", row => {
    expect(KiwibankPageBoundaryZ.safeParse(row).success).toEqual(true)
  })
})
