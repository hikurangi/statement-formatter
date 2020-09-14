import { KiwibankXLSXRow } from '../types'
import {
  getIsAccountSeparatorRow,
  getIsPageEndRow,
  // mergeReferenceRows
} from '.'

test('Can accurately identify an Account Separator row', () => {
  const sampleRow = ["Account Name:                                   H J SIMPSON-BOUVIER\r\nProduct Name:                                    BIG-FUN MONEY LORDS\r\nPersonalised Name:                           FLAT\r\nAccount Number:                                  12-3456-7891011-12\r\nStatement Period:                              2 January 1985 to 21 February 2076"]

  expect(getIsAccountSeparatorRow(sampleRow)).toBeTruthy();
});

test('Can accurately identify an Account Separator row which is missing a Personalised Name', () => {
  const sampleRow = ["Account Name:                                   H J SIMPSON-BOUVIER\r\nProduct Name:                                    BIG-FUN MONEY LORDS\r\nAccount Number:                                  12-3456-7891011-12\r\nStatement Period:                              2 January 1985 to 21 February 2076"]

  expect(getIsAccountSeparatorRow(sampleRow)).toBeTruthy();
});

test('Does not wrongly identify a non-Account Separator Row', () => {
  const sampleRow = ["10 Dec"]
  expect(getIsAccountSeparatorRow(sampleRow)).toBeFalsy();
})

test('Can accurately identify a page-end row', () => {
  const sampleRow = [
    "Page 3 of 3 (Please turn over)"
  ]

  expect(getIsPageEndRow(sampleRow)).toBeTruthy();
});

test('Does not wrongly identify a non-Account Separator Row', () => {
  const sampleRow = ["10 Dec"]
  expect(getIsAccountSeparatorRow(sampleRow)).toBeFalsy();
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