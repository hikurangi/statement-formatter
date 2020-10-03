interface KiwibankCSVRow {
  'Account number': string;
  Date: string;
  'Memo/Description': string;
  'Source Code(payment type)': string;
  'TP ref': string;
  'TP part': string;
  'TP code': string;
  'OP ref': string;
  'OP part': string;
  'OP code': string;
  'OP name': string;
  'OP Bank Account Number': string;
  'Amount(credit)': number;
  'Amount(debit)': number;
  Amount: number;
  Balance: number;
}

interface KiwibankAccountDetails {
  'Account Name': string;
  'Product Name': string;
  'Personalised Name'?: string;
  'Account Number': string;
  'Statement Period': string;
  // NOTE: We are assuming a statement cannot cross a calendar year
  'Statement Year': number;
}

// https://central.xero.com/s/article/Import-a-CSV-bank-statement#Preparethedatainthefile
interface XeroCSVRow {
  Date: string;
  Amount: number;
  Payee: string;
  Description: string;
  Reference: string;
  'Analysis code'?: string;
  'Transaction Type'?: string;
  'Cheque number'?: string; // ?
}

interface MapperInputs {
  readPath: string;
  writePath: string;
}

type KiwibankXLSXStatementLine = [
  string, // Date
  string, // Payee
  null | number, // Withdrawals
  null | number, // Deposits
  number // Balance
]

type KiwibankXLSXReferenceLine = [
  string, // Date
  string // Reference
]

type AccountHeader = [
  string
]

// PageEnd also matches AccountHeader
type PageEnd = [
  null,
  null,
  null,
  null,
  string
]

type KiwibankXLSXRow = 
  KiwibankXLSXStatementLine
  | KiwibankXLSXReferenceLine
  | AccountHeader
  | PageEnd

type XeroFormattedStatement = Map<string, Array<XeroCSVRow>>

export {
  MapperInputs,
  KiwibankAccountDetails,
  KiwibankCSVRow,
  KiwibankXLSXRow,
  XeroCSVRow,
  XeroFormattedStatement
}