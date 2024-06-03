// Configuration interfaces
export interface FormatRowsConfig {
  // NOTE: this will break when we wrap around a new year (a Jan 15 monthly statement)
  accountNumber: string
  startingBalance: number
  year: string
}

export interface MapRowConfig extends FormatRowsConfig {
  metaDescription?: Array<string>
}
