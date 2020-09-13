import * as path from 'path'
import mapStatement from './src/map-statement'

const FILE_NAME = 'test'
const readPath = path.resolve(__dirname, 'assets', `${FILE_NAME}.CSV`)
const writePath = path.resolve(__dirname, 'output', `${FILE_NAME}-formatted.csv`)

// TODO: nice interface. CLI?
mapStatement({ readPath, writePath })