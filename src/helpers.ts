import { KiwibankCSVRow } from './types';

const payeeKeys: (keyof KiwibankCSVRow)[] = [
  'OP name',
  'OP Bank Account Number'
]

const referenceKeys: (keyof KiwibankCSVRow)[] = [
  'TP ref',
  'TP part',
  'TP code',
  'OP ref',
  'OP part',
  'OP code'
]

const getCellValue = (keys: (keyof KiwibankCSVRow)[], row: KiwibankCSVRow): string => {
  let cellContents: (string | number)[] = [];

  keys.forEach(k => {
    if (row[k]) {
      cellContents.push(row[k])
    }
  })

  return cellContents.join(' ; ');
}

const getPayee = (row: KiwibankCSVRow): string => getCellValue(payeeKeys, row)
const getReference = (row: KiwibankCSVRow): string => getCellValue(referenceKeys, row)

export {
  getPayee,
  getReference
}