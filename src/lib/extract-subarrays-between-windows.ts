import { curry } from 'ramda'

type Predicate<T> = (window: Array<T>) => boolean
interface ExtractSubarraysBetweenWindowsConfig<T> {
  startWindowSize: number
  endWindowSize: number
  isStartWindow: Predicate<T>
  isEndWindow: Predicate<T>
}

const extractSubarraysBetweenWindows = curry(
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
    // a predicate matching end window.
    // This could be done without specifying the size of
    // the start and end windows but providing these params
    // saves a bunch of pointless iterating.

    // TODO: write a normal, readable functional version of this one
    // I'm beginning to learn that the form for these recursive algos
    // is a curried OUTER FUNCTION which takes config
    // inside this, we define the actual recursive function
    // with config leaking in via the parent function scope
    // this is fine because the config is absolutely static.

    // That said, it's feasible that the config could be dynamic,
    // changing during the recursion. Spoopy! 👻

    const subarrays: Array<Array<T>> = []
    let i = 0

    while (i <= array.length - startWindowSize) {
      // Check for the start of a new subarray
      if (isStartWindow(array.slice(i, i + startWindowSize))) {
        const start = i
        i += startWindowSize // Move index past the start window

        // Find the end of the current subarray
        while (
          i <= array.length - endWindowSize &&
          !isEndWindow(array.slice(i, i + endWindowSize))
        ) {
          i++
        }

        if (i <= array.length - endWindowSize) {
          // Include the end window in the subarray
          subarrays.push(array.slice(start, i + endWindowSize))
          i += endWindowSize // Move index past the end window
        } else {
          // If no end window is found, include up to the end of the array
          subarrays.push(array.slice(start))
          break
        }
      } else {
        i++
      }
    }

    return subarrays
  }
)

export default extractSubarraysBetweenWindows
