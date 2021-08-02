open FSharp.Data
open System.IO

let uri =
    "/Users/Hikurangi/Desktop/csv/38-9012-0507117-00_17Jun - 06-03-2012 to 17-06-2021.csv"

type KiwibankAccount =
    CsvProvider<"/Users/Hikurangi/Desktop/csv/38-9012-0507117-00_17Jun - 06-03-2012 to 17-06-2021.csv", HasHeaders=true, IgnoreErrors=true>

type NamedAccountChunk =
    { Name: string
      Chunk: seq<KiwibankAccount.Row> }

[<EntryPoint>]
let main argv =
    let chunked =
        (KiwibankAccount.Load uri).Rows
        |> Seq.chunkBySize 1000

    let baseDirectory = __SOURCE_DIRECTORY__

    let baseDirectory' =
        Directory.GetParent(baseDirectory).FullName

    let baseDirectory'' =
        Directory.GetParent(baseDirectory').FullName

    for chunk in chunked do
        let fileName =
            $"{(chunk |> Seq.head).Date} to {(chunk |> Seq.last).Date}.csv"

        let fullPath =
            Path.Combine(baseDirectory'', "output", fileName)

        let sw = new StreamWriter(fullPath)

        let writeableChunk =
            (new KiwibankAccount(chunk |> List.ofSeq))
                .SaveToString()

        sw.Write writeableChunk
        sw.Close()

    0 // return an integer exit code
