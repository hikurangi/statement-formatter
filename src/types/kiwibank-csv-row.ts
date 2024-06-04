import { z } from 'zod'
import { OUTPUT_DATE_FORMAT_REGEX } from '../lib/kiwibank-date-format-regex'

// NOTE: zod is probably overkill for now
// we only need this for parsing in the other direction
const KiwibankCSVRowZ = z.object({
  'Account number': z.string(),
  Date: z.string().regex(OUTPUT_DATE_FORMAT_REGEX), // regex
  'Memo/Description': z.string(),
  'Source Code(payment type)': z.string(),
  'TP ref': z.string(),
  'TP part': z.string(),
  'TP code': z.string(),
  'OP ref': z.string(),
  'OP part': z.string(),
  'OP code': z.string(),
  'OP name': z.string(),
  'OP Bank Account Number': z.string(), // regex
  'Amount(credit)': z.number(), // only positive
  'Amount(debit)': z.number(), // only positive
  Amount: z.number(), // positive or negative
  Balance: z.number(), // positive or negative
})
export type KiwibankCSVRowT = z.infer<typeof KiwibankCSVRowZ>
