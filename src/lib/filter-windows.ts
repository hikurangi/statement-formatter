import { append, concat, head, slice, tail, take } from 'ramda'

type Predicate<T> = (window: Array<T>) => boolean
type FilterWindowsConfig<T> = {
  predicate: Predicate<T>
  windowSize: number
}

const filterWindows = <T>(
  config: FilterWindowsConfig<T>,
  filteredArray: Array<T>,
  remainingArray: Array<T>
): Array<T> => {
  const { predicate, windowSize }: FilterWindowsConfig<T> = config
  // NOTE: this is fucking dumb but so am I:
  // if predicate(target) === true, then it is NOT filtered

  if (windowSize >= remainingArray.length) {
    if (predicate(remainingArray) === false) {
      return filteredArray
    } else {
      return concat(filteredArray, remainingArray)
    }
  } else {
    const currentWindow = take(windowSize, remainingArray)
    if (predicate(currentWindow) === false) {
      return filterWindows(
        config,
        filteredArray,
        slice(windowSize, Infinity, remainingArray)
      )
    } else {
      return filterWindows(
        config,
        // NOTE: I hate to see the bang below as much as you do, but windowSize >= remainingArray.length
        // precludes head being undefined. If it's not there, then you can worry.
        append(head(remainingArray)!, filteredArray),
        tail(remainingArray)
      )
    }
  }
}

export default filterWindows
