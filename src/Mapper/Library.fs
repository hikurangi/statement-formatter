namespace Mapper

/// <summary>The Mapper's transform method maps Kiwibank rows to Xero rows</summary>
/// <returns>A stringified Xero-formatted CSV</returns>
module Transformer =
    open FSharp.Data

    // TODO: investigate whether it's possible to pass in types/transformations
    // in order to keep this decoupled + generic
    type KiwibankAccount = CsvProvider<"data/kiwibank-sample.csv", HasHeaders=true>
    type XeroAccount = CsvProvider<"data/xero-sample.csv", HasHeaders=true>

    let private mapAccounts (row: KiwibankAccount.Row) =
        XeroAccount.Row(
            row.Date,
            row.Amount,
            row.``OP name``,
            (row.``Memo/Description``.Split(" ;").[0]),
            (row.``Memo/Description``.Split(" ;").[1]), // TODO: investigate whether this gracefully handles nulls. Looks like a runtime failure just waiting to happen.
            "",
            row.``Source Code (payment type)``,
            ""
        )

    let transform rows =
        let parsed =
            (KiwibankAccount.Parse rows).Rows
            |> Seq.map mapAccounts

        (new XeroAccount(parsed)).SaveToString().Trim()
