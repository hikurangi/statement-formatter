namespace Reader

open System

module Read =
  // Define a function to read 10 lines from a csv
  let fromCSV fileName lineCount =
    Seq.empty