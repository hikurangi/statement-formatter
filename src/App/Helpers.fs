module Helpers

open System.IO

let formatDate (dateStr: string) =
    match dateStr.Split("-") with
        | [| dd; mm; year |] -> [ year; mm; dd ] |> System.String.Concat
        | date -> failwith $"Invalid date format encountered {date}"
    
let extractDateFromRow (str: string) =
    str.Split(',')
    |> Seq.tryItem 1 // date is the first item in the row
    |> (function
        | Some d -> d
        | None -> failwith $"Date not found in row: '{str}'")
    
let getLastFullRow chunk =
    let reversed = chunk |> Seq.rev

    match reversed |> Seq.head with
    | "" -> reversed |> Seq.item 1
    | n -> n
    
let writeFile headers chunk =
    let fileString =
        chunk
        |> Seq.fold (fun s r -> s + "\n" + r) headers

    let startDate = chunk |> Seq.head |> extractDateFromRow |> formatDate

    let endDate =
        chunk |> getLastFullRow |> extractDateFromRow |> formatDate

    let fileName = $"{startDate} to {endDate}.csv"

    let parentDirectory =
        Directory.GetParent(__SOURCE_DIRECTORY__).FullName

    let baseDirectory =
        Directory.GetParent(parentDirectory).FullName

    let fullPath =
        (baseDirectory, "output", fileName)
        |> Path.Combine

    let sw = new StreamWriter(fullPath)
    sw.Write fileString
    sw.Close()
