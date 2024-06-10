import { z } from 'zod'
import { EmptyStringOrSpaceZ } from './shared.js'
import { KIWIBANK_DATE_FORMAT } from '../lib/kiwibank-date-format-regex.js'
import { CURRENCY_REGEX_SIGNED } from '../lib/currency-regex.js'

export const KiwibankStatementFinalLineZ = z.tuple([
  z.string().regex(KIWIBANK_DATE_FORMAT),
  EmptyStringOrSpaceZ,
  z.literal('Closing Account Balance...'),
  EmptyStringOrSpaceZ,
  z.string().regex(CURRENCY_REGEX_SIGNED),
])
