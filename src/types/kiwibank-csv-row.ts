import { z } from 'zod'

const KiwibankCSVRowZ = z.object({
  'Account number': z.string(),
  Date: z.string(),
  'Memo/Description': z.string(),
  'Source Code(payment type)': z.string(),
  'TP ref': z.string(),
  'TP part': z.string(),
  'TP code': z.string(),
  'OP ref': z.string(),
  'OP part': z.string(),
  'OP code': z.string(),
  'OP name': z.string(),
  'OP Bank Account Number': z.string(),
  'Amount(credit)': z.number(),
  'Amount(debit)': z.number(),
  Amount: z.number(),
  Balance: z.number(),
})
export type KiwibankCSVRowT = z.infer<typeof KiwibankCSVRowZ>
