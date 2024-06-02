import {
  CURRENCY_REGEX_SIGNED,
  CURRENCY_REGEX_UNSIGNED,
} from '../src/lib/currency-regex'

describe('Currency regex', () => {
  test.each(['$3.00', '$1,234.56', '$10,234,345.02'])(
    '%s does match as unsigned currency',
    value => {
      expect(CURRENCY_REGEX_UNSIGNED.test(value)).toEqual(true)
    }
  )

  test.each(['1,234.56', '$10,23,345.02', '$1', '99.0', '$12.0', '-$9,342.85'])(
    '%s does not match as unsigned currency',
    value => {
      expect(CURRENCY_REGEX_UNSIGNED.test(value)).toEqual(false)
    }
  )

  test.each(['$3.00', '$1,234.56', '$10,234,345.02', '-$3,667,605.43'])(
    '%s does match as signed currency',
    value => {
      expect(CURRENCY_REGEX_SIGNED.test(value)).toEqual(true)
    }
  )

  test.each([
    '-$1,2,34.56',
    '$10,23,345.02',
    '$1',
    '99.0',
    '$12.0',
    '-9,342.85',
  ])('%s does not match as signed currency', value => {
    expect(CURRENCY_REGEX_SIGNED.test(value)).toEqual(false)
  })
})
