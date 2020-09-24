import fs from 'fs'
import path from 'path'
import pdf from 'pdf-parse'
import { XeroCSVRow } from '../types'

const FILE_NAME = '2013-Nov-01_Personal'
const filePath = path.join(__dirname, '..', '..', 'assets', 'pdf', `${FILE_NAME}.pdf`)
let dataBuffer = fs.readFileSync(filePath)

const SEPARATOR = ' ^!^ '

interface PdfItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: [
    number,
    number,
    number,
    number,
    number,
    number
  ];
  fontName: string;
}

type FormattedRow = DepositRow | WithdrawalRow

interface DepositRow {
  Date: string;
  Transaction: string;
  Deposits: string;
  Balance: string;
}

interface WithdrawalRow {
  Date: string;
  Transaction: string;
  Balance: string;
  Withdrawals: string;
}

type RowMap = Map<number, Array<PdfItem>>

const options = {
  pagerender: page => {
    // console.log(JSON.stringify(page, null, 2))
    //check documents https://mozilla.github.io/pdf.js/
    let render_options = {
      //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
      normalizeWhitespace: false,
      //do not attempt to combine same line TextItem's. The default value is `false`.
      disableCombineTextItems: false
    }

    return page.getTextContent(render_options)
      .then((textContent: { items: any }) => {

        const rows: RowMap = textContent.items.reduce((rows: RowMap, item: PdfItem) => {
          const yPosition = item.transform[5]

          const existingRow = rows.get(yPosition) || []
          const updatedRow = [...existingRow, item]

          // sort rows by x-position
          const sortedUpdatedRow = updatedRow.sort((a, b) => a.transform[4] - b.transform[4])

          const updatedRows = new Map(rows)
          const updateInPlace = updatedRows.set(yPosition, sortedUpdatedRow)

          return updateInPlace
        }, new Map())

        const unsortedRows = Array.from(rows.entries())
        const sortedRows = unsortedRows.sort((a, b) => b[0] - a[0])
        const adjustedRows = sortedRows.map(row => row[1])

        // const xValues = new Set()
        // adjustedRows.forEach(row => row.forEach(cell => xValues.add(cell.transform[4])))
        // const xs = Array.from(xValues)
        // const sortedXValues = xs.sort((a, b) => a - b)

        // console.log(xs)
        // const adjustedRows = sortedRows.map(row => row[1].map(cell => ({
        //   text: cell.str,
        //   x: cell.transform[4],
        //   y: cell.transform[5]
        // })))

        // const headerAlignment: Map<keyof FormattedRow, number> = new Map([
        //   ['Date', 50]
        //   ['Transaction', 120]
        //   ['Withdrawals', 300]
        //   ['Deposits', 400]
        //   ['Balance', 500]
        // ])

        const partiallyFormattedRows: Array<FormattedRow> = []

        adjustedRows.forEach(row => {

          const updateRow = row.reduce((currentRow: FormattedRow, cell): FormattedRow => {
            if (row.length < 4) {
              return currentRow
            }

            const xPosition = cell.transform[4]

            if (xPosition > 500) {
              currentRow.Balance = cell.str
            } else if (xPosition > 400) {
              currentRow.Deposits = cell.str
            } else if (xPosition > 300) {
              currentRow.Withdrawals = cell.str
            } else if (xPosition > 120) {
              currentRow.Transaction = cell.str
            } else if (xPosition > 50) {
              currentRow.Date = cell.str
            } else {
              console.info(`Attribute '${cell.str}' is out of x-range`)
            }

            return currentRow
          }, { })
          
          console.log({updateRow})

          partiallyFormattedRows.push(updateRow)
        })

        // const xeroRows = adjustedRows.map((row: Array<PdfItem>): Array<FormattedRow> => row.reduce((row: FormattedRow, cell): FormattedRow => {
        //   const xPosition = cell.transform[4]

        //   if (xPosition > 500) {
        //     row[headers[4]] = cell.str
        //   }
        //   // if x value is 56.689, it belongs in the date column // Date 56.689  -> header 0 / minimum threshold 0

        //   // if x value is 127.55, it belongs in the transaction column // Transaction 127.55 -> header 1 / minimum threshold 127

        //   // if x value > 300 / header 2
        //   // Withdrawals 323.839 -> 352.06800000000004
        //   // safe to say that if x > 500, it belongs in balance column /

        //   // if x value > 400 / 3
        //   // Deposits 411.284 -> 417.368

        //   // x > 500 / 4
        //   // Balance 500.195

        //   return row
        // }, {}))


        // console.log(JSON.stringify(adjustedRows, null, 2))
      });
  }
}


const transformPDF = () => {
  pdf(dataBuffer, options).then(data => {
    console.log({data})
    // // number of pages
    // console.log(data.numpages);
    // // number of rendered pages
    // console.log(data.numrender);
    // // PDF info
    // console.log(data.info);
    // // PDF metadata
    // console.log(data.metadata);
    // // PDF.js version
    // // check https://mozilla.github.io/pdf.js/getting_started/
    // console.log(data.version);
    // // PDF text
    // console.log(data.text);

  })
}

export default transformPDF