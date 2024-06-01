import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
// const exports = {}

import splitWheneverInclusive from '../lib/splitWheneverInclusive'
const pdfPath = process.argv[2] || './assets/test.pdf'

// // Will be using promises to load document, pages and misc data instead of
// // callback.
const main = async () => {
  //   const { getDocument } = await import('pdfjs-dist')
  const loadingTask = getDocument(pdfPath)
  loadingTask.promise
    .then(function (doc) {
      const numPages = doc.numPages
      console.log('# Document Loaded')
      console.log('Number of Pages: ' + numPages)
      console.log()
      let lastPromise // will be used to chain promises
      lastPromise = doc.getMetadata().then(function (data) {
        console.log('# Metadata Is Loaded')
        console.log('## Info')
        console.log(JSON.stringify(data.info, null, 2))
        console.log()
        if (data.metadata) {
          console.log('## Metadata')
          console.log(JSON.stringify(data.metadata.getAll(), null, 2))
          console.log()
        }
      })
      const loadPage = function (pageNum: number) {
        return doc.getPage(pageNum).then(function (page) {
          console.log('# Page ' + pageNum)
          const viewport = page.getViewport({ scale: 1.0 })
          console.log('Size: ' + viewport.width + 'x' + viewport.height)
          console.log()
          return page
            .getTextContent()
            .then(function (content) {
              type Item = (typeof content.items)[number]
              // iterate through list
              // first time: item has no
              // 1 - split 'items' by hasEOL - after each, begin a new array
              //   const itemsSplitOnEOL = splitWheneverInclusive<Item>(
              //     (item: Item) => 'hasEOL' in item && item.hasEOL === true,
              //     content.items
              //   )
              //   // 2 - extract strings
              //   const cleanList = itemsSplitOnEOL.map(row =>
              //     row.map(cell => ('str' in cell ? cell.str : ''))
              //   )
              //   console.log({ cleanList })
              // Content contains lots of information about the text layout and
              // styles, but we need only strings at the moment
              //   const strings = content.items.map(item =>
              //     'str' in item ? item.str : ''
              //   )
              //   console.log('## Text Content')
              //   console.log(strings)
              // Release page resources.
              page.cleanup()
            })
            .then(function () {
              console.log()
            })
          return
        })
      }
      // Loading of the first page will wait on metadata and subsequent loadings
      // will wait on the previous pages.
      for (let i = 1; i <= numPages; i++) {
        lastPromise = lastPromise.then(loadPage.bind(null, i))
      }
      return lastPromise
    })
    .then(
      function () {
        console.log('# End of Document')
      },
      function (err) {
        console.error('Error: ' + err)
      }
    )
}
// Process

// 1. Ingest PDF
// 2. Convert PDF to shitty array
// 3. Tests to get the bits
// 3. Clean up array
// 4. Map to csv
// 5. Write that shit out

// ?. Tests

main()
