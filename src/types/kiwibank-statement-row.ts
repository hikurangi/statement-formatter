import { z } from 'zod'
import { KIWIBANK_DATE_FORMAT } from '../lib/kiwibank-date-format-regex.js'
import {
  CurrencyStringSignedZ,
  CurrencyStringUnsignedZ,
  EmptySpaceStringZ,
} from './shared.js'

export const KiwibankStandardRowZ = z.tuple([
  z.string().regex(KIWIBANK_DATE_FORMAT), // Date
  EmptySpaceStringZ,
  z.string(), // max length? // Memo
  EmptySpaceStringZ,
  CurrencyStringUnsignedZ, // amount - needs to be determined by checking previous balance 🙄 - always an absolute value
  EmptySpaceStringZ,
  CurrencyStringSignedZ, // balance - is signed cause it can be negative
])
export type KiwibankStandardRowT = z.infer<typeof KiwibankStandardRowZ>

export const KiwibankStandardRowEndingZ = z.tuple([
  CurrencyStringUnsignedZ, // amount - needs to be determined by checking previous balance 🙄
  EmptySpaceStringZ,
  CurrencyStringSignedZ,
])
