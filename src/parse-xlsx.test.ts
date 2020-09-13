import { isAccountSeparatorRow } from './parse-xlsx'

test('Can accurately identify an Account Separator Row', () => {
  const sampleRow = ["Account Name:                                   H J SIMPSON-BOUVIER\\r\\nProduct Name:                                    BIG-FUN MONEY LORDS\\r\\nPersonalised Name:                           FLAT\\r\\nAccount Number:                                  12-3456-7891011-12\\r\\nStatement Period:                              2 January 1985 to 21 February 2076"]

  expect(isAccountSeparatorRow(sampleRow)).toBeTruthy();
});

test('Does not wrongly identify a non-Account Separator Row', () => {
  const sampleRow = ["10 Dec"]
  expect(isAccountSeparatorRow(sampleRow)).toBeFalsy();
})