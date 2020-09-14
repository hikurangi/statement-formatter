import { KiwibankXLSXRow, KiwibankAccountDetails } from '../types'

// Kiwibank
const accountSeparatorRegex = /(Account Name):\s+(.+)\r\n(Product Name):\s+(.+)\r\n((Personalised Name):\s+(.+)\r\n)?(Account Number):\s+(\d\d-\d{4}-\d{7}-\d\d)\r\n(Statement Period):\s+(\d{1,2} \w+ \d{4} to \d{1,2} \w+ \d{4})/i

const getIsAccountHeader = (row: KiwibankXLSXRow[]) => row?.length === 1
  ? accountSeparatorRegex.test(row[0])
  : false

const getAccountDetailsFromHeader = (details: KiwibankXLSXRow[]): KiwibankAccountDetails => {
  const output: KiwibankAccountDetails = {
    'Account Name': '',
    'Product Name': '',
    'Account Number': '',
    'Statement Period': '',
    'Statement Year': 0
  }

  details[0]
    // account headers have the separators in the regex below
    .split(/\r\n/)
    // additionally, the attribute
    .map(attr => attr.split(/:\s+/))
    .forEach((attr) => {
      const attrKey = attr[0]
      const attrValue: number | string = attr[1]

      if (attrKey === 'Statement Period') {
        const yearMatch = /\d{4}/.exec(attrValue)

        if (Array.isArray(yearMatch) === false) {
          throw new Error(`Year not found in the following Statement Period: ${attrValue}`)
        }

        const statementYear = Number(yearMatch)
        output['Statement Year'] = statementYear
      }

      // still some work to do typing this
      output[attrKey] = attrValue
    })

  return output
}

const pageEndRegex = /Page \d{1,2} of \d{1,2} \(Please turn over\)/

const getIsPageEndRow = (row: string[]) => row?.length === 1
  ? pageEndRegex.test(row[0])
  : false

const headerRow = [
  'Date',
  'Transaction',
  'Withdrawals',
  'Deposits',
  'Balance'
]

export {
  getIsAccountHeader,
  getAccountDetailsFromHeader,
  getIsPageEndRow,
  headerRow
}