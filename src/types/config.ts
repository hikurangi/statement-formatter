// Configuration interfaces
export type FormatRowsConfig = {
  // NOTE: this will break when we wrap around a new year (a Jan 15 monthly statement)
  accountNumber: string
  startingBalance: number
  year: string
}

export type MapRowConfig = {
  metaDescription?: Array<string>
} & FormatRowsConfig
