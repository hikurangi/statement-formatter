import { curry, flow, slice } from 'ramda'

export type WindowComparisonPredicate<T> = (window: Array<T>) => boolean
type ExtractSubarraysBetweenWindowsConfig<T> = {
  startWindowSize: number
  endWindowSize: number
  isStartWindow: WindowComparisonPredicate<T>
  isEndWindow: WindowComparisonPredicate<T>
}
type Predicate<T> = (item: T, idx: number, list: Array<T>) => boolean
const findIndexOf =
  <T>(fn: Predicate<T>) =>
  (list: Array<T>): number => {
    let idx = 0
    const len = list.length
    while (idx < len) {
      if (fn(list[idx], idx, list)) {
        return idx
      }
      idx += 1
    }
    return -1
  }

const extractSubarraysBetweenWindowsInclusive = curry(
  <T>(
    {
      startWindowSize,
      endWindowSize,
      isStartWindow,
      isEndWindow,
    }: ExtractSubarraysBetweenWindowsConfig<T>,
    array: Array<T>
  ): Array<Array<T>> => {
    // We want to grab all rows of an array from the beginning of
    // a predicate-matching starting window, to the end of
    // a predicate matching end window. They do not overlap.
    // This could be done without specifying the size of
    // the start and end windows but providing these params
    // saves a bunch of pointless iterating.

    const findStartIndex = (startIdx: number, arr: Array<T>): number =>
      flow(arr, [
        slice(startIdx, Infinity),
        findIndexOf<T>((_, idx, _list): boolean =>
          isStartWindow(
            slice(startIdx + idx, startIdx + idx + startWindowSize, arr)
          )
        ),
      ])

    const findEndIndex = curry((startIdx: number, arr: Array<T>): number =>
      flow(arr, [
        slice(startIdx, Infinity),
        a =>
          a.findIndex((_, idx) =>
            isEndWindow(
              slice(startIdx + idx, startIdx + idx + endWindowSize, arr)
            )
          ),
      ])
    )

    const extractSubarrays = (
      startIdx: number,
      arr: Array<T>
    ): Array<Array<T>> => {
      const startIndex = findStartIndex(startIdx, arr)
      if (startIndex === -1) return []

      const actualStartIndex = startIdx + startIndex + startWindowSize
      const endIndex = findEndIndex(actualStartIndex, arr)
      if (endIndex === -1) return [slice(startIdx + startIndex, Infinity, arr)]

      const actualEndIndex = actualStartIndex + endIndex + endWindowSize
      return [
        slice(startIdx + startIndex, actualEndIndex, arr),
        ...extractSubarrays(actualEndIndex, arr),
      ]
    }

    return extractSubarrays(0, array)
  }
)

export default extractSubarraysBetweenWindowsInclusive
