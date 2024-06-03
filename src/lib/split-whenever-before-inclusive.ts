const splitWheneverBeforeInclusive = <T>(
  predicate: (item: T) => boolean,
  arr: Array<T>
): Array<Array<T>> => {
  const result: Array<Array<T>> = []
  let currentSubarray: Array<T> = []

  for (const item of arr) {
    if (predicate(item)) {
      if (currentSubarray.length > 0) {
        result.push(currentSubarray)
      }
      // initialise the next sub-array with
      // the item which has just satisfied
      // the predicate
      currentSubarray = [item]
    } else {
      currentSubarray.push(item)
    }
  }

  if (currentSubarray.length > 0) {
    result.push(currentSubarray)
  }

  return result
}

export default splitWheneverBeforeInclusive
