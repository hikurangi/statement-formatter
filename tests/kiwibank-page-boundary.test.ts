import { KiwibankPageBoundaryZ } from '../src/types/kiwibank-page-boundary'

describe('Kiwibank page boundary', () => {
  test.each([
    [
      [
        'ST 7083 020804',
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
        'ST 7083 020804',
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
        'ST 7083 020804',
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
        'ST 7083 020804',
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
        'ST 7083 020804',
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
