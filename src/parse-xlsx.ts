import fs from 'fs'
import path from 'path'
import xlsx from 'node-xlsx'
import { XeroCSVRow } from './types'
import {
  getIsAccountSeparatorRow,
  // getIsPageEndRow,
  // headerRow
} from './kiwibank'
import { accountNumberRegex } from './constants'

// Parameters
const FILE_NAME = '2013-Dec-31_Personal (1)-converted.xlsx'
const file = path.join(__dirname, '..', 'assets', 'xlsx', FILE_NAME)

// should return an array to be handled (written to the filesystem, for example) elsewhere
const parseXLSX = () => {

  // Combine all pages
  const pages = xlsx.parse(fs.readFileSync(file));
  const rows = pages.reduce((allPages, page) => allPages.concat(page.data), [])

  // 0. do a formatting pass
  const formatted = rows.reduce((selectedRows, currentRow, index) => {
    if (getIsAccountSeparatorRow(currentRow) === true) {

    }
  }, {})
  // 1. get account separator row
  // 2. get account number and year from that
  // a. check that from + to years are the same
  // b. if not the same, throw and error
  // 3. get/double check header row (hard coded or live?)
  // 4. format row as proper Xero row, including
  // 5. do a row-merge checkahead

  const accounts = new Map<string, XeroCSVRow[]>()

  for (let i = 0; i < rows.length; i++) {
    const currentRow = rows[i]

    if (getIsAccountSeparatorRow(currentRow) === true) {
      const accountNumberMatch = accountNumberRegex.exec(currentRow)

      // TODO: test - might the account number match be in a different position, not zero?
      if (!accountNumberMatch || !accountNumberMatch[0]) {
        throw new Error(`There was a problem finding an account number in the following row: ${currentRow}`)
      }

      // we assume that an account separator row only occurs once per
      if (accounts.has(accountNumberMatch[0])) {
        throw new Error(`Account number '${accountNumberMatch[0]}' already exists in this row: ${currentRow}`)
      }

      accounts.set(accountNumberMatch[0], [])
    }

  }
  const accountSeparatorRows = rows.filter(getIsAccountSeparatorRow)

  console.log(JSON.stringify(accountSeparatorRows, null, 2))
  console.log(JSON.stringify(rows, null, 2))
}

export default parseXLSX

// if a row has only two entries, (date and reference) then it is a reference for the previous row
// confirm this by matching its date to the date from the previous row
// const combineReferenceRows = (rows: string[]) => {
//   for (let i = 0; i < rows.length; i++) {

//     const currentElement = rows[i];
//     const previousElement = rows[i - 1]

//   }
// }

// there might be duplicate pages. compare before combining
