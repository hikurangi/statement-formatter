import { z } from 'zod'
import { EmptyStringOrSpaceZ } from './shared.js'
const KIWIBANK_STATEMENT_NUMBER_REGEX = /\bST \d{4} \d{6}\b/
const KIWIBANK_PAGE_NUMBER_REGEX =
  /\bPage \d{1,2} of \d{1,2}( \(Please turn over\))?\b/

export const KiwibankPageBoundaryZ = z.tuple([
  z.string().regex(KIWIBANK_STATEMENT_NUMBER_REGEX),
  z.string().regex(KIWIBANK_PAGE_NUMBER_REGEX),
  EmptyStringOrSpaceZ,
  z.literal('Date'),
  EmptyStringOrSpaceZ,
  z.literal('Transaction'),
  EmptyStringOrSpaceZ,
  z.literal('Withdrawals'),
  EmptyStringOrSpaceZ,
  z.literal('Deposits'),
  EmptyStringOrSpaceZ,
  z.literal('Balance'),
  EmptyStringOrSpaceZ,
])
