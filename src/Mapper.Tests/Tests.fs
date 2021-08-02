module Tests

open Xunit
open Swensen.Unquote
open Mapper

[<Fact>]
let ``When we supply a Kiwibank row we get a stringified Xero row`` () =
    let result = Transformer.transform "Account number,Date,Memo/Description,Source Code (payment type),TP ref,TP part,TP code,OP ref,OP part,OP code,OP name,OP Bank Account Number,Amount (credit),Amount (debit),Amount,Balance
77-1111-1111111-00,17-04-2018,UBER BV 800-592-8996 ;,,,,,,,,,,,34.49,-34.49,100.97"
    let expected = "Date,Amount,Payee,Description,Reference,Cheque Number,Transaction Type,Analysis code\n17-04-2018,-34.49,,UBER BV 800-592-8996,,,,"
    result =! expected