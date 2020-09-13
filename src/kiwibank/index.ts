// Kiwibank
const accountSeparatorRegex = /Account Name:\s+(.+)\r\nProduct Name:\s+(.+)\r\n(Personalised Name:\s+(.+)\r\n)?Account Number:\s+(\d\d-\d{4}-\d{7}-\d\d)\r\nStatement Period:\s+\d{1,2} \w+ \d{4} to \d{1,2} \w+ \d\d\d\d/i

const getIsAccountSeparatorRow = (row: string[]) => row?.length === 1
  ? accountSeparatorRegex.test(row[0])
  : false

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
  getIsAccountSeparatorRow,
  getIsPageEndRow,
  headerRow
}