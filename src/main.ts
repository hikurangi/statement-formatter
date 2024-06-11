import { resolve } from 'node:path'
import { writeToPath } from '@fast-csv/format'

import { PDFDocumentProxy, getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import {
  TextContent,
  TextItem,
  TextMarkedContent,
} from 'pdfjs-dist/types/src/display/api.js'
import { add, chain, flow, map, pipe, prop, range } from 'ramda'

import { kiwibankCSVRowHeaders } from './types/kiwibank-csv-row.js'
import { KiwibankAccountHeaderZ } from './types/kiwibank-account-headers.js'
import { KiwibankStatementFinalLineZ } from './types/kiwibank-statement-final-line.js'
import extractSubarraysBetweenWindows from './lib/extract-subarrays-between-windows.js'
import formatAccountStatement from './lib/format-account-statement.js'
import { AccountStatementT } from './types/account-statement.js'

const pdfPath = process.argv[2] || './input/test.pdf'

const __dirname = import.meta.dirname

const loadPage = async (pageNum: number, doc: PDFDocumentProxy) => {
  const page = await doc.getPage(pageNum)
  const content = await page.getTextContent()
  return content
}

// TODO: can this work point-free with pipe?
const getDocumentPagePromises = (doc: PDFDocumentProxy) =>
  flow(doc, [
    prop('numPages'),
    add(1),
    range(1),
    map(pageNumber => loadPage(pageNumber, doc)),
  ])

const resolveAllPromises = async <T>(promises: Array<Promise<T>>) =>
  await Promise.all(promises)

const mapTextContentToAccountStatements = pipe(
  chain((page: TextContent) => page.items),
  map((row: TextItem | TextMarkedContent) => ('str' in row ? row.str : '')),
  extractSubarraysBetweenWindows({
    startWindowSize: 19,
    endWindowSize: 5,
    isStartWindow: window => KiwibankAccountHeaderZ.safeParse(window).success,
    isEndWindow: window =>
      KiwibankStatementFinalLineZ.safeParse(window).success,
  }),
  map(formatAccountStatement)
)

const writeAccountsToDisk = (accountStatements: Array<AccountStatementT>) =>
  accountStatements.forEach(({ accountNumber, statementPeriod, statement }) => {
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
  })

// Pipeline
getDocument(pdfPath)
  .promise.then(getDocumentPagePromises)
  .then(resolveAllPromises)
  .then(mapTextContentToAccountStatements)
  .then(writeAccountsToDisk)
  .then(() => console.log('# End of Document'))
  .catch(err => console.error('Error: ' + err))
