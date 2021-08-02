namespace Mapper

/// <summary>The Mapper's Transform method maps Kiwibank rows to Xero rows</summary>
/// <returns>A stringified Xero-formatted CSV</returns>
module Mapper =
    open FSharp.Data

    type KiwibankAccount = CsvProvider<"data/kiwibank-sample.csv", HasHeaders=true>
    type XeroAccount = CsvProvider<"data/xero-sample.csv", HasHeaders=true>

    let public Transform rows = 
      ""

    // Memo/Description -> split at ;, first part is Description, second part is Reference
    // Date -> Date
    // Source Code (payment type) -> Transaction Type
    // Amount -> Amount
    // OP name -> Payee