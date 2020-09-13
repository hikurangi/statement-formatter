import * as fs from 'fs'
import * as csv from 'fast-csv'
import { getPayee, getReference } from './helpers'
import { MapperInputs, KiwibankCSVRow, XeroCSVRow } from './types'

// should return an array to be handled elsewhere
const mapStatement = ({
  readPath,
  writePath
}: MapperInputs): void => {

  const writeAccess = fs.createWriteStream(writePath)

  fs.createReadStream(readPath)
    .pipe(csv.parse({ headers: true }))
    // pipe the parsed input into a csv formatter
    .pipe(
      csv.format<KiwibankCSVRow, XeroCSVRow>({ headers: true }),
    )
    // Using the transform function from the formatting stream
    .transform((row, next): void => next(null, {
      Date: row.Date,
      Amount: row.Amount,
      Payee: getPayee(row),
      Description: row['Memo/Description'],
      Reference: getReference(row),
      'Analysis code': '',
      'Transaction Type': ''
    }))
    .pipe(writeAccess)
    .on('end', () => process.exit());
}

export default mapStatement