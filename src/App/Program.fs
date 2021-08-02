open System.IO
open Helpers
open Mapper

/// <summary>We're handling all the IO out here. Everything else lives inside</summary>
[<EntryPoint>]
let main _argv =
    // TODO:
    // - handle errors in this regard
    // - supply output destination
    // - optimise for performance with laziness
    // - decouple input and output sources from main program - split into different apps?
    // - actually parse CSV so we can tweak the headers

    // - (see immediately below) pull file location from args
    let uri =
        "/Users/Hikurangi/Desktop/csv/38-9012-0507117-00_17Jun - 06-03-2012 to 17-06-2021.csv"

    // 1. Read file in (based on supplied arg) -> later
    let sr = new StreamReader(uri)
    // let headers = sr.ReadLine()

    let transformed = sr.ReadToEnd() |> Transformer.transform
    
    // 2. Chunk file into correct sizes
    let chunks = transformed |> Seq.chunkBySize 999 // plus header row is 1000 total // TODO: the final chunk has an empty string at the end - remove it

    // 3. Write chunks to files
    // chunks |> Seq.iter (writeFile headers)
    sr.Close()

    0
