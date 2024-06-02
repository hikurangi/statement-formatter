import { z } from 'zod'
import KIWIBANK_DATE_FORMAT_REGEX from '../lib/kiwibank-date-format-regex.js'
import {
  CURRENCY_REGEX_SIGNED,
  CURRENCY_REGEX_UNSIGNED,
} from '../lib/currency-regex.js'

const EmptySpaceStringZ = z.literal(' ')
export const CurrencyStringUnsignedZ = z.string().regex(CURRENCY_REGEX_UNSIGNED)
export const CurrencyStringSignedZ = z.string().regex(CURRENCY_REGEX_SIGNED)

export const KiwibankStandardRowZ = z.tuple([
  z.string().regex(KIWIBANK_DATE_FORMAT_REGEX), // Date
  EmptySpaceStringZ,
  z.string(), // max length? // Memo
  EmptySpaceStringZ,
  CurrencyStringUnsignedZ, // amount - needs to be determined by checking previous balance 🙄 - always an absolute value
  EmptySpaceStringZ,
  CurrencyStringSignedZ, // balance - is signed cause it can be negative
])
type KiwibankStandardRowT = z.infer<typeof KiwibankStandardRowZ>

export const KiwibankStandardRowEndingZ = z.tuple([
  CurrencyStringUnsignedZ, // amount - needs to be determined by checking previous balance 🙄
  EmptySpaceStringZ,
  CurrencyStringSignedZ,
])
