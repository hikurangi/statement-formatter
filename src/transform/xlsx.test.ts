import transformXLSX from './transform-xlsx'

test('Processes an XLSX to PDF correctly', () => {
  const actual = transformXLSX(["Account Name:                                   H J SIMPSON-BOUVIER\r\nProduct Name:                                    BIG-FUN MONEY LORDS\r\nAccount Number:                                  12-3456-7891011-12\r\nStatement Period:                              14 January 2076 to 21 February 2076"])

  const expected = {
    'Account Name': 'H J SIMPSON-BOUVIER',
    'Product Name': 'BIG-FUN MONEY LORDS',
    'Account Number': '12-3456-7891011-12',
    'Statement Period': '14 January 2076 to 21 February 2076',
    'Statement Year': 2076
  }

  expect(actual).toEqual(expected);
})
