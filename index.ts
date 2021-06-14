import fs from 'fs'
import path from 'path'
import xlsx from 'node-xlsx'

import transformCSV from './src/transform/csv'
import transformXLSX from './src/transform/xlsx'
import transformPDF from './src/transform/pdf'
import { XeroCSVRow } from './src/types'

const CSV_FILE_NAME = 'test'
const readPath = path.resolve(__dirname, 'assets', 'csv', `${CSV_FILE_NAME}.CSV`)
const writePath = path.resolve(__dirname, 'output', `${CSV_FILE_NAME}-formatted.csv`)

// TODO: nice interface. CLI?
transformCSV({ readPath, writePath })

// Parameters
const XLSX_FILE_NAME = '2013-Dec-31_Personal (1)-converted.xlsx'
const file = path.join(__dirname, 'assets', 'xlsx', XLSX_FILE_NAME)

// Combine all pages
const pages = xlsx.parse(fs.readFileSync(file));
const rows: XeroCSVRow[] = pages.reduce((allPages, page) => allPages.concat(page.data), [])

// should return an array to be handled (written to the filesystem, for example) elsewhere
transformXLSX(rows)

const PDF_FILE_NAME = '2013-Nov-01_Personal'
const pdfFilePath = path.join(__dirname, 'assets', 'pdf', `${PDF_FILE_NAME}.pdf`)
let dataBuffer = fs.readFileSync(pdfFilePath)

const result = transformPDF(dataBuffer)
console.log({result})