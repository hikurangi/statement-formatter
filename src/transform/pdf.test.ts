import fs from 'fs'
import path from 'path'
// import { XeroCSVRow } from '../types';
import transformPDF from './pdf'

const PDF_FILE_NAME = '2013-Nov-01_Personal'
const pdfFilePath = path.join(__dirname, 'assets', 'pdf', `${PDF_FILE_NAME}.pdf`)

let dataBuffer = fs.readFileSync(pdfFilePath)

const actual = transformPDF(dataBuffer)

test('Transformed PDF has both accounts', () => {

  expect(actual.keys()).toEqual([
    '38-9012-0507117-01',
    '38-9012-0507117-02'
  ])

});

test('Transformed PDF accounts have correct rows', () => {

  expect(actual['38-9012-0507117-01']).toEqual(expect.arrayContaining([
    // Withdrawal
    {
      "Date": "01-08-2013",
      "Amount": -0.16,
      "Payee": "TRANSFER TO E H W T A K SCHAVERIEN-KAA - 00",
      "Description": "TRANSFER TO E H W T A K SCHAVERIEN-KAA - 00",
      "Reference": "TRANSFER TO E H W T A K SCHAVERIEN-KAA - 00"
    },
    //Deposit
    {
      "Date": "07-08-2013",
      "Amount": 234.50,
      "Payee": "TRANSFER TO E H K W T A K SCHAVERIEN-KAA - 00",
      "Description": "TRANSFER FROM E H K W T A K SCHAVERIEN-KAA - 00",
      "Reference": "TRANSFER FROM E H K W T A K SCHAVERIEN-KAA - 00"
    },
    // Combined reference row
    {
      "Date": "31-08-2013",
      "Amount": 0.02,
      "Payee": "IRD WITHHOLDING TAX 17.500%",
      "Description": "IRD WITHHOLDING TAX 17.500%",
      "Reference": "IRD WITHHOLDING TAX 17.500%"
    },
    // Row from the second statement page
    {
      "Date": "31-10-2013",
      "Amount": -0.02,
      "Payee": "IRD WITHHOLDING TAX 17.500%",
      "Description": "IRD WITHHOLDING TAX 17.500%",
      "Reference": "IRD WITHHOLDING TAX 17.500%"
    }
  ]))

  expect(actual['38-9012-0507117-02']).toEqual(expect.arrayContaining([
    {
      "Date": "26-08-2013",
      "Amount": -231.99,
      "Payee": "PAY GENESIS POWER - GENESIS ENERGY LTD",
      "Description": "PAY GENESIS POWER - GENESIS ENERGY LTD",
      "Reference": "PAY GENESIS POWER - GENESIS ENERGY LTD"
    },
    {
      "Date": "31-10-2013",
      "Amount": 0.04,
      "Payee": "IRD WITHHOLDING TAX 17.500%",
      "Description": "IRD WITHHOLDING TAX 17.500%",
      "Reference": "IRD WITHHOLDING TAX 17.500%"
    }
  ]))

})