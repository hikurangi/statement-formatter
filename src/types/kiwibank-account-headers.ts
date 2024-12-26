import { z } from 'npm:zod'
import { EmptyStringOrSpaceZ } from './shared.ts'
import { KIWIBANK_ACCOUNT_HEADER_DATE_RANGE_FORMAT } from '../lib/kiwibank-date-format-regex.ts'
import ACCOUNT_NUMBER_REGEX from '../lib/account-number-regex.ts'

export const KiwibankAccountHeaderZ = z.tuple([
  z.literal('Account Name:'),
  EmptyStringOrSpaceZ,
  z.string(), // Account holder name
  EmptyStringOrSpaceZ,
  z.literal('Product Name:'),
  EmptyStringOrSpaceZ,
  z.string(), // 'Product name',
  EmptyStringOrSpaceZ,
  z.literal('Personalised Name:'),
  EmptyStringOrSpaceZ,
  z.string(), //   'Personalised Name:',
  EmptyStringOrSpaceZ,
  z.literal('Account Number:'),
  EmptyStringOrSpaceZ,
  z.string().regex(ACCOUNT_NUMBER_REGEX),
  EmptyStringOrSpaceZ,
  z.literal('Statement Period:'),
  EmptyStringOrSpaceZ,
  z.string().regex(KIWIBANK_ACCOUNT_HEADER_DATE_RANGE_FORMAT),
])
