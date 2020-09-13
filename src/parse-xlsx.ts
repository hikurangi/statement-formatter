import fs from 'fs'
import path from 'path'
import xlsx from 'node-xlsx'

const FILE_NAME = '2013-Dec-31_Personal (1)-converted.xlsx'
// Parse a file

// if a row has only two entries, (date and reference) then it is a reference for the previous row
// confirm this by matching its date to the date from the previous row
const combineReferenceRows = (rows: string[]) => {
  for (let i = 0; i < rows.length; i++) {

    const currentElement = rows[i];
    const previousElement = rows[i-1]
    
  }
}

// Kiwibank
const AccountSeparatorRegex = /Account Name:\s+(.+)\\r\\nProduct Name:\s+(.+)\\r\\nPersonalised Name:\s+(.+)\\r\\nAccount Number:\s+(\d\d-\d\d\d\d-\d{7}-\d\d)\\r\\nStatement Period:\s+\d{1,2} \w+ \d\d\d\d to \d{1,2} \w+ \d\d\d\d/

const isAccountSeparatorRow = (row: string[]) => row?.length === 1
  ? AccountSeparatorRegex.test(row[0])
  : false

// there might be duplicate pages. compare before combining

const parseXLSX = () => {
  // Parse a buffer
  const pages = xlsx.parse(fs.readFileSync(path.join(__dirname, '..', 'assets', 'xlsx', FILE_NAME)));
  
  const combinedPageRows = pages.reduce((allPages, page) => allPages.concat(page.data), [])

  console.log(JSON.stringify(combinedPageRows, null, 2))
}

export {
  isAccountSeparatorRow,
  combineReferenceRows,
  parseXLSX
}