import { resolve } from 'node:path'
import { writeToPath } from '@fast-csv/format'

import { PDFDocumentProxy, getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import {
  TextItem,
  TextMarkedContent,
} from 'pdfjs-dist/types/src/display/api.js'
import { chain, flow, map, range } from 'ramda'

import { kiwibankCSVRowHeaders } from './types/kiwibank-csv-row.js'
import { KiwibankAccountHeaderZ } from './types/kiwibank-account-headers.js'
import { KiwibankStatementFinalLineZ } from './types/kiwibank-statement-final-line.js'
import extractSubarraysBetweenWindows from './lib/extract-subarrays-between-windows.js'
import formatAccountStatement from './lib/format-account-statement.js'

const pdfPath = process.argv[2] || './input/test.pdf'

const __dirname = import.meta.dirname

const loadPage = async (pageNum: number, doc: PDFDocumentProxy) => {
  const page = await doc.getPage(pageNum)
  const content = await page.getTextContent()
  return content
}

getDocument(pdfPath)
  .promise.then(async doc => {
    const pagePromises = flow(doc.numPages + 1, [
      range(1),
      map(pageNumber => loadPage(pageNumber, doc)),
    ])

    // TODO: this whole promise could be a pipeline
    // the pipeline could be a meeting
    // the meeting could be an email
    // the email could just walk into the ocean
    // and never be seen again
    const accountStatements = flow(await Promise.all(pagePromises), [
      chain(page => page.items),
      map((row: TextItem | TextMarkedContent) =>
        // is there a better way to type R.flow?
        'str' in row ? row.str : ''
      ),
      extractSubarraysBetweenWindows({
        startWindowSize: 19,
        endWindowSize: 5,
        isStartWindow: window =>
          KiwibankAccountHeaderZ.safeParse(window).success,
        isEndWindow: window =>
          KiwibankStatementFinalLineZ.safeParse(window).success,
      }),
      map(formatAccountStatement),
    ])

    return accountStatements
  })
  .then(async accountStatements => {
    accountStatements.forEach(
      ({ accountNumber, statementPeriod, statement }) => {
        const filePath = resolve(
          // TODO: CLI app
          // pass in input file
          // pass in output folder
          __dirname,
          '..',
          '..',
          'output',
          `${accountNumber} - ${statementPeriod}.csv`
        )
        writeToPath(filePath, [kiwibankCSVRowHeaders, ...statement])
          .on('error', err => {
            return console.error(err)
          })
          .on('finish', () => {
            console.log(
              `${accountNumber} - ${statementPeriod} written successfully!`
            )
          })
      }
    )

    console.log('# End of Document')
  })
  .catch(err => {
    console.error('Error: ' + err)
  })
