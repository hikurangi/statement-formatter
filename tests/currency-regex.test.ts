import { describe, test } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'

import {
  CURRENCY_REGEX_SIGNED,
  CURRENCY_REGEX_UNSIGNED,
} from '../src/lib/currency-regex.ts'

describe('Currency regex', () => {
  for (const testCase of [
    '$3.00',
    '$1,234.56',
    '$10,234,345.02',
    '$1,803.84',
  ]) {
    test(`${testCase} does match as unsigned currency`, () => {
      expect(CURRENCY_REGEX_UNSIGNED.test(testCase)).toEqual(true)
    })
  }

  for (const testCase of [
    '1,234.56',
    '$10,23,345.02',
    '$1',
    '99.0',
    '$12.0',
    '-$9,342.85',
  ]) {
    test(`${testCase} does not match as unsigned currency`, () => {
      expect(CURRENCY_REGEX_UNSIGNED.test(testCase)).toEqual(false)
    })
  }

  for (const testCase of [
    '$3.00',
    '$1,234.56',
    '$10,234,345.02',
    '-$3,667,605.43',
  ])
    test(`${testCase} does match as signed currency`, () => {
      expect(CURRENCY_REGEX_SIGNED.test(testCase)).toEqual(true)
    })

  for (const testCase of [
    '-$1,2,34.56',
    '$10,23,345.02',
    '$1',
    '99.0',
    '$12.0',
    '-9,342.85',
  ]) {
    test(`${testCase} does not match as signed currency`, () => {
      expect(CURRENCY_REGEX_SIGNED.test(testCase)).toEqual(false)
    })
  }
})
