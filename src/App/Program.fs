open System.IO

let getDateFromRow (str: string) =
    str.Split(',')
    |> Seq.tryItem 1
    |> function
        | Some d -> d
        | None -> failwith "Date was missing from row"

let writeFile headers chunk =
    let fileString =
        chunk
        |> Seq.fold (fun s r -> s + "\n" + r) headers

    let startDate = chunk |> Seq.head |> getDateFromRow
    let endDate = chunk |> Seq.last |> getDateFromRow
    let fileName = $"{startDate} to {endDate}.csv"

    let baseDirectory =
        (Directory.GetParent(__SOURCE_DIRECTORY__).FullName
         |> Directory.GetParent)
            .FullName

    let fullPath =
        Path.Combine(baseDirectory, "output", fileName)

    let sw = new StreamWriter(fullPath)
    sw.Write fileString
    sw.Close()

[<EntryPoint>]
let main _argv =
    // TODO:
    // - handle errors in this regard
    // - supply output destination
    // - optimise for performance with laziness
    // - decouple input and output sources from main program - split into different apps?
    // - actually parse CSV so we can tweak the headers

    // - (see immediately below) pull file location from args
    let uri = ""
    let sr = new StreamReader(uri)
    let headers = sr.ReadLine()

    sr.ReadToEnd().Split('\n')
    |> Seq.tail // skip the header row
    |> Seq.chunkBySize 1000
    |> Seq.map List.ofArray
    |> Seq.iter (writeFile headers)

    sr.Close()
    0
