import { resolve } from 'node:path'

import { writeToPath } from 'npm:@fast-csv/format'

import {
  PDFDocumentProxy,
  getDocument,
} from 'npm:pdfjs-dist/legacy/build/pdf.mjs'
import {
  TextContent,
  TextItem,
  TextMarkedContent,
} from 'npm:pdfjs-dist/types/src/display/api.mjs'
import { add, chain, flow, map, pipe, prop, range } from 'npm:ramda'

import { kiwibankCSVRowHeaders } from './types/kiwibank-csv-row.ts'

import { KiwibankAccountHeaderZ } from './types/kiwibank-account-headers.ts'
import { KiwibankStatementFinalLineZ } from './types/kiwibank-statement-final-line.ts'
import extractSubarraysBetweenWindowsInclusive from './lib/extract-subarrays-between-windows-inclusive.ts'
import formatAccountStatement from './lib/format-account-statement.ts'
import { AccountStatementT } from './types/account-statement.ts'
import process from 'node:process'

const pdfPath = process.argv[2] || './input/test.pdf'

const __dirname = import.meta.dirname

const loadPage = async (pageNum: number, doc: PDFDocumentProxy) => {
  const page = await doc.getPage(pageNum)
  const content = await page.getTextContent()
  return content
}

// TODO: can this work point-free with pipe?
// TODO: switch to ts-belt for a (presumably) point-free solution
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
  extractSubarraysBetweenWindowsInclusive({
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
