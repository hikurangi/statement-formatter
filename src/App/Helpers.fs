module Helpers

open System.IO

let getDateFromRow (str: string) =
    str.Split(',')
    |> Seq.tryItem 1
    |> function
        | Some d -> d
        | None -> failwith $"Date not found in row: '{str}'"

let getLastFullRow chunk =
    let reversed = chunk |> Seq.rev

    match reversed |> Seq.head with
    | "" -> reversed |> Seq.item 1
    | n -> n

let writeFile headers chunk =
    let fileString =
        chunk
        |> Seq.fold (fun s r -> s + "\n" + r) headers

    let startDate = chunk |> Seq.head |> getDateFromRow

    let endDate =
        chunk |> getLastFullRow |> getDateFromRow

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
