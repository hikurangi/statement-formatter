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

export {
  MapperInputs,
  KiwibankCSVRow,
  XeroCSVRow
}