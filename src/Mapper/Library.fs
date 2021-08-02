namespace Mapper

module Say =
    let hello name =
        printfn "Hello %s" name

// Memo/Description -> split at ;, first part is Description, second part is Reference
// Date -> Date
// Source Code (payment type) -> Transaction Type
// Amount -> Amount
// OP name -> Payee

// Cheque Number	Analysis code
// TP ref	TP part	TP code	OP ref	OP part	OP code OP Bank Account Number 0