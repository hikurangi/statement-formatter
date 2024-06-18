import { append, concat, head, slice, tail, take } from 'ramda'

type Predicate<T> = (window: Array<T>) => boolean
type FilterWindowsConfig<T> = {
  predicate: Predicate<T>
  windowSize: number
}

const filterWindows = <T>(
  { predicate, windowSize }: FilterWindowsConfig<T>,
  array: Array<T>
) => {
  // TODO: will break on windowSize === 0
  const filterRecursively = (
    filteredArray: Array<T>,
    remainingArray: Array<T>
  ): Array<T> =>
    windowSize >= remainingArray.length
      ? predicate(remainingArray)
        ? concat(filteredArray, remainingArray)
        : filteredArray
      : predicate(take(windowSize, remainingArray))
      ? filterRecursively(
          append(head(remainingArray) as T, filteredArray),
          tail(remainingArray)
        )
      : filterRecursively(
          filteredArray,
          slice(windowSize, Infinity, remainingArray)
        )

  return filterRecursively([], array)
}

export default filterWindows
