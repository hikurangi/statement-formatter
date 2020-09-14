import { KiwibankXLSXRow } from '../types'
import {
  getAccountDetailsFromHeader,
  getIsAccountHeader,
  getIsPageEndRow,
  // mergeReferenceRows
} from '.'

test('Can accurately identify an Account Separator row', () => {
  const sampleRow = ["Account Name:                                   H J SIMPSON-BOUVIER\r\nProduct Name:                                    BIG-FUN MONEY LORDS\r\nPersonalised Name:                           FLAT\r\nAccount Number:                                  12-3456-7891011-12\r\nStatement Period:                              2 January 1985 to 21 February 2076"]

  expect(getIsAccountHeader(sampleRow)).toBeTruthy();
});

test('Can accurately identify an Account Separator row which is missing a Personalised Name', () => {
  const sampleRow = ["Account Name:                                   H J SIMPSON-BOUVIER\r\nProduct Name:                                    BIG-FUN MONEY LORDS\r\nAccount Number:                                  12-3456-7891011-12\r\nStatement Period:                              2 January 1985 to 21 February 2076"]

  expect(getIsAccountHeader(sampleRow)).toBeTruthy();
});

test('Does not wrongly identify a non-Account Separator Row', () => {
  const sampleRow = ["10 Dec"]
  expect(getIsAccountHeader(sampleRow)).toBeFalsy();
})

test('Can accurately identify a page-end row', () => {
  const sampleRow = [
    "Page 3 of 3 (Please turn over)"
  ]

  expect(getIsPageEndRow(sampleRow)).toBeTruthy();
})

// test('Can accurately identify a page-end row full of nulls', () => {
//   const sampleRow = [
//     null,
//     null,
//     null,
//     null,
//     "Page 3 of 3 (Please turn over)"
//   ]

//   expect(getIsPageEndRow(sampleRow)).toBeTruthy();
// })

test('Can extract details from account header', () => {
  const sampleRow = ["Account Name:                                   H J SIMPSON-BOUVIER\r\nProduct Name:                                    BIG-FUN MONEY LORDS\r\nPersonalised Name:                           FLAT\r\nAccount Number:                                  12-3456-7891011-12\r\nStatement Period:                              14 January 2076 to 21 February 2076"]

  const expected = {
    'Account Name': 'H J SIMPSON-BOUVIER',
    'Product Name': 'BIG-FUN MONEY LORDS',
    'Personalised Name': 'FLAT',
    'Account Number': '12-3456-7891011-12',
    'Statement Period': '14 January 2076 to 21 February 2076',
    'Statement Year': 2076
  }

  expect(getAccountDetailsFromHeader(sampleRow)).toEqual(expected);
})

test('Can extract details from account header which is missing a Personalised Name', () => {
  const sampleRow = ["Account Name:                                   H J SIMPSON-BOUVIER\r\nProduct Name:                                    BIG-FUN MONEY LORDS\r\nAccount Number:                                  12-3456-7891011-12\r\nStatement Period:                              14 January 2076 to 21 February 2076"]

  const expected = {
    'Account Name': 'H J SIMPSON-BOUVIER',
    'Product Name': 'BIG-FUN MONEY LORDS',
    'Account Number': '12-3456-7891011-12',
    'Statement Period': '14 January 2076 to 21 February 2076',
    'Statement Year': 2076
  }

  expect(getAccountDetailsFromHeader(sampleRow)).toEqual(expected);
})

// test('Merges reference rows appropriately', () => {
//   const sampleSection: KiwibankXLSXRow[] = [[
//     "17 Nov",
//     "Money in from ol' mate",
//     null,
//     128.67,
//     132.36
//   ],
//   [
//     "17 Nov",
//     "Ref: Tent"
//   ]]

//   const expected = [
//     [
//       "17 Nov",
//       "Money in from ol' mate",
//       null,
//       128.67,
//       132.36,
//       "Ref: Tent"
//     ]
//   ]
//   expect(mergeReferenceRows(sampleSection)).toEqual(expected);
// })

// test('Does not merge unrelated reference rows', () => {
//   const sampleSection: KiwibankXLSXRow[] = [[
//     "17 Nov",
//     "Money in from ol' mate",
//     null,
//     128.67,
//     132.36
//   ],
//   [
//     "18 Nov",
//     "Ref: Tent"
//   ]]

//   const expected = [[
//     "17 Nov",
//     "Money in from ol' mate",
//     null,
//     128.67,
//     132.36
//   ],
//   [
//     "18 Nov",
//     "Ref: Tent"
//   ]]
//   expect(mergeReferenceRows(sampleSection)).toEqual(expected);
// })