import {
  getIsAccountSeparatorRow,
  getIsPageEndRow
} from './parse-xlsx'

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