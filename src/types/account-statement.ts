import { z } from 'zod'
import ACCOUNT_NUMBER_REGEX from '../lib/account-number-regex'
import { KiwibankStandardRowZ } from './kiwibank-statement-row'
import { KIWIBANK_ACCOUNT_HEADER_DATE_RANGE_FORMAT } from '../lib/kiwibank-date-format-regex'

export const AccountStatementZ = z.object({
  accountNumber: z.string().regex(ACCOUNT_NUMBER_REGEX),
  startingBalance: z.number(),
  accountName: z.string(),
  productName: z.string(),
  personalisedName: z.string(),
  statementPeriod: z.string().regex(KIWIBANK_ACCOUNT_HEADER_DATE_RANGE_FORMAT),
  statement: z.array(KiwibankStandardRowZ),
})
export type AccountStatementT = z.infer<typeof AccountStatementZ>

export default AccountStatementZ
