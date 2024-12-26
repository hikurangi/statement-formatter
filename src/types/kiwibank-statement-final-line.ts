import { z } from 'npm:zod'
import { EmptyStringOrSpaceZ } from './shared.ts'
import { KIWIBANK_DATE_FORMAT } from '../lib/kiwibank-date-format-regex.ts'
import { CURRENCY_REGEX_SIGNED } from '../lib/currency-regex.ts'

export const KiwibankStatementFinalLineZ = z.tuple([
  z.string().regex(KIWIBANK_DATE_FORMAT),
  EmptyStringOrSpaceZ,
  z.literal('Closing Account Balance...'),
  EmptyStringOrSpaceZ,
  z.string().regex(CURRENCY_REGEX_SIGNED),
])
