import { curry } from 'ramda'

interface FilterWindowsConfig<T> {
  predicate: (window: Array<T>) => boolean
  windowSize: number
}
// This function is like regular filter, but allows us to filter
// out contiguous windows of rows of size 'windowSize'
// based on a predicate called on that entire window
const filterWindows = curry(
  <T>(
    { predicate, windowSize }: FilterWindowsConfig<T>,
    array: Array<T>
  ): Array<T> => {
    const result: Array<T> = []
    for (let i = 0; i <= array.length - windowSize; i++) {
      const window = array.slice(i, i + windowSize)
      if (predicate(window)) {
        result.push(...window)
      }
    }
    return result
  }
)

export default filterWindows
// // Example usage:
// const numbers: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// const filtered: Array<number> = filterWindows(
//   numbers,
//   3,
//   window => window.reduce((acc, curr) => acc + curr, 0) > 10
// )
// console.log(filtered) // Output: [4, 5, 6, 7, 8, 9, 10]
