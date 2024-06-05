import { z } from 'zod'
import { takeLast } from 'ramda'
import {
  CURRENCY_REGEX_SIGNED,
  CURRENCY_REGEX_UNSIGNED,
} from '../lib/currency-regex.js'
import {
  KiwibankStandardRowEndingZ,
  KiwibankStandardRowT,
} from './kiwibank-statement-row.js'

export const isStandardKiwibankRow = (
  item: any
): item is KiwibankStandardRowT => {
  if (!Array.isArray(item) || item.length < 3) {
    return false
  } else {
    // does this row terminate in the following thee cells: // amount, ' ', balance
    const lastThreeRows = takeLast(3, item)

    const amount = lastThreeRows[0]
    const amountResult = CurrencyStringSignedZ.safeParse(amount).success

    const space = lastThreeRows[1]
    const spaceResult = EmptySpaceStringZ.safeParse(space).success

    const balance = lastThreeRows[2]
    const balanceResult = CurrencyStringSignedZ.safeParse(balance).success

    return (
      amountResult === true && spaceResult === true && balanceResult === true
    )
  }
}

export const EmptySpaceStringZ = z.literal(' ')
export const EmptyStringZ = z.literal('')
export const EmptyStringOrSpaceZ = z.union([EmptySpaceStringZ, EmptyStringZ])

export const CurrencyStringUnsignedZ = z.string().regex(CURRENCY_REGEX_UNSIGNED)
export const CurrencyStringSignedZ = z.string().regex(CURRENCY_REGEX_SIGNED)
