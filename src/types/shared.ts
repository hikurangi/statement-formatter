import { z } from 'zod'
import { takeLast } from 'ramda'
import {
  CURRENCY_REGEX_SIGNED,
  CURRENCY_REGEX_UNSIGNED,
} from '../lib/currency-regex.js'
import { KiwibankPDFRowT } from './kiwibank-statement-row.js'

export const isStandardKiwibankPDFRow = (
  item: any
): item is KiwibankPDFRowT => {
  if (!Array.isArray(item) || item.length < 3) {
    return false
  } else {
    // does this row terminate in the following thee cells: // amount, ' ', balance
    const lastThreeRows = takeLast(3, item)

    // we have an existing validator, KiwibankStandardRowEndingZ, but it is giving false positives.
    // The regex tests for its first and third strings don't seem to be firing, or the regexes are wrong.
    // For now, we are doing this directly with each validator, which works so far.
    const amount = lastThreeRows[0]
    const amountResult = CurrencyStringSignedZ.safeParse(amount).success

    const space = lastThreeRows[1]
    const spaceResult = EmptySpaceStringZ.safeParse(space).success

    const balance = lastThreeRows[2]
    const balanceResult = CurrencyStringSignedZ.safeParse(balance).success

    const result =
      amountResult === true && spaceResult === true && balanceResult === true
    return result
  }
}

export const EmptySpaceStringZ = z.literal(' ')
export const EmptyStringZ = z.literal('')
export const EmptyStringOrSpaceZ = z.union([EmptySpaceStringZ, EmptyStringZ])

export const CurrencyStringUnsignedZ = z.string().regex(CURRENCY_REGEX_UNSIGNED)
export const CurrencyStringSignedZ = z.string().regex(CURRENCY_REGEX_SIGNED)
