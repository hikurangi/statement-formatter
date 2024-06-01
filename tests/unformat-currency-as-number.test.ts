import unformatCurrencyAsNumber from '../src/lib/unformat-currency-as-number'

describe('The unformat function', () => {
  test('unformats a long figure', () => {
    const longNumber = '$11,435.04'
    const actual = unformatCurrencyAsNumber(longNumber)
    const expected = 11435.04

    expect(actual).toEqual(expected)
  })

  test('unformats negative number as absolute value', () => {
    const longNumber = '$-9.00'
    const actual = unformatCurrencyAsNumber(longNumber)
    const expected = 9.0

    expect(actual).toEqual(expected)
  })
})
