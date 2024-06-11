const unformatCurrencyAsNumber = (str: string): number =>
  Number(str.replace(/[^0-9.]+/g, ''))

export default unformatCurrencyAsNumber
