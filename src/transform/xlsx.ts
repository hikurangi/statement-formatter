import fs from 'fs'
import path from 'path'
import xlsx from 'node-xlsx'
import { XeroCSVRow } from '../types'
import {
  // getIsPageEndRow,
  // headerRow,
  getIsAccountHeader,
  getAccountDetailsFromHeader
} from '../kiwibank'

const transformXLSX = (rows: Array<XeroCSVRow>) => {
  for (let i = 0; i < rows.length; i++) {
    const currentRow = rows[i]

    // 1. get account header row
    if (getIsAccountHeader(currentRow) === true) {
      // 2. get account header details
      const currentAccountDetails = getAccountDetailsFromHeader(currentRow)
      // console.log({currentAccountDetails})

      // 3. get/double check header row (hard coded or live?)
      // 4. format row as proper Xero row, including
      // 5. do a row-merge checkahead
    }

  }
  const accountSeparatorRows = rows.filter(getIsAccountHeader)

  // console.log(accounts.keys())
  // console.log(JSON.stringify(accountSeparatorRows, null, 2))
  // console.log(JSON.stringify(rows, null, 2))
}

export default transformXLSX

// if a row has only two entries, (date and reference) then it is a reference for the previous row
// confirm this by matching its date to the date from the previous row
// const combineReferenceRows = (rows: string[]) => {
//   for (let i = 0; i < rows.length; i++) {

//     const currentElement = rows[i];
//     const previousElement = rows[i - 1]

//   }
// }

// there might be duplicate pages. compare before combining
