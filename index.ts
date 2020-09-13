import * as path from 'path'
import mapStatement from './src/map-statement'
import { parseXLSX } from './src/parse-xlsx'

const FILE_NAME = 'test'
const readPath = path.resolve(__dirname, 'assets', 'csv', `${FILE_NAME}.CSV`)
const writePath = path.resolve(__dirname, 'output', `${FILE_NAME}-formatted.csv`)

// TODO: nice interface. CLI?
mapStatement({ readPath, writePath })

parseXLSX()