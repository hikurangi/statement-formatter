import { slice } from 'ramda'
import { formatRows } from './format-rows.js'
import unformatCurrencyAsNumber from './unformat-currency-as-number.js'
import {
  KIWIBANK_ACCOUNT_HEADER_DATE_RANGE_FORMAT,
  KIWIBANK_DATE_FORMAT,
} from './kiwibank-date-format-regex.js'
import splitWheneverBeforeInclusive from './split-whenever-before-inclusive.js'
import filterWindows from './filter-windows.js'
import { isKiwibankPageBoundary } from '../types/kiwibank-page-boundary.js'
import { KiwibankCSVRowT } from '../types/kiwibank-csv-row.js'
import { AccountStatementT } from '../types/account-statement.js'

const formatAccountStatement = (
  rawAccount: Array<string>
): AccountStatementT => {
  // NOTE: positional lookup seems super brittle
  // but the statements are consistent!
  // we will see once we try multiple statements
  const accountNumber = rawAccount[14]
  const startingBalance = unformatCurrencyAsNumber(rawAccount[36])

  const accountRows = slice(37, -6, rawAccount) || []

  const dateString = rawAccount[18]
  // TODO: handle wraparound statements - Dec thru Jan
  const year = dateString.match(KIWIBANK_ACCOUNT_HEADER_DATE_RANGE_FORMAT)
    ?.groups?.startYear

  if (!year) {
    // TODO: proper, grown-up monadic error handling

    console.error(
      `Invalid year from date row '${dateString}' in account '${rawAccount}'`
    )
  }

  const filteredRows = filterWindows(
    {
      windowSize: 13,
      predicate: window => !isKiwibankPageBoundary(window),
    },
    accountRows
  )

  const splitRows = splitWheneverBeforeInclusive<string>(
    item => KIWIBANK_DATE_FORMAT.test(item),
    filteredRows
  )
  const statement: Array<KiwibankCSVRowT> = formatRows(
    {
      accountNumber,
      previousBalance: startingBalance,
      // see type guard above, checking for undefined 'year' variable
      // if you don't see one, then uh oh! 😱
      year: year!,
    },
    splitRows,
    []
  )

  return {
    accountName: rawAccount[2],
    productName: rawAccount[6],
    personalisedName: rawAccount[10],
    accountNumber,
    statementPeriod: rawAccount[18],
    startingBalance,
    statement,
  }
}

export default formatAccountStatement
