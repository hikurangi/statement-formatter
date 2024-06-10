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

const pdfPath = process.argv[2] || './assets/test.pdf'

const loadingTask = getDocument(pdfPath)

const loadPage = async (pageNum: number, doc: PDFDocumentProxy) => {
  const page = await doc.getPage(pageNum)
  console.log('# Page ' + pageNum)
  const viewport = page.getViewport({ scale: 1 })
  console.log('Size: ' + viewport.width + 'x' + viewport.height)
  const content = await page.getTextContent()
  return content
}

loadingTask.promise
  .then(async doc => {
    const data = await doc.getMetadata()
    console.log('# Document Loaded')
    console.log('Number of Pages: ' + doc.numPages)
    console.log('## Info')
    console.log(JSON.stringify(data.info, null, 2))
    if (data.metadata) {
      console.log('## Metadata')
      console.log(JSON.stringify(data.metadata.getAll(), null, 2))
    }
    return doc
  })
  .then(async doc => {
    const { numPages } = doc
    const pageNumbers = range(1, numPages + 1)
    const promises = map(pageNumber => loadPage(pageNumber, doc), pageNumbers)

    const windowSize = 19

    const pages = await Promise.all(promises)
    const items = chain(page => page.items, pages)
    const itemsSplitBeforeDate = splitWheneverBeforeInclusive(
      item => 'str' in item && KIWIBANK_DATE_FORMAT.test(item.str),
      items
    )
    const cleanList = itemsSplitBeforeDate.map(row =>
      row.map(cell => ('str' in cell ? cell.str : ''))
    )
    console.log({ cleanList })
    const itemsWithPossibleMetadataHeaders = cleanList.filter(
      item => item.length >= windowSize
    )
    const contiguousItemsWithPossibleMetadataHeaders = flatten(
      itemsWithPossibleMetadataHeaders
    )

    // we wanna start splitting stuff from the start of each accountHeaders subarray
    // then we can terminate after "closing balance"

    const accountHeaders = findSubarraysBy(
      contiguousItemsWithPossibleMetadataHeaders,
      windowSize,
      candidate => KiwibankAccountHeaderZ.safeParse(candidate).success
    )
    // connect each header to its subsequent account rows,
    // while pulling off the relevant data (year, account number, nickname)

    console.log({ accountHeaders })
    // return lastPromise
  })
  .then(() => {
    console.log('# End of Document')
  })
  .catch(err => {
    console.error('Error: ' + err)
  })

// 2. find where the actual statement starts

// 3. strip out the page numbers

// 1. Identify the different accounts in a given statement using the text block
// 2. split them out
// 3. clean up / strip page numbers etc
