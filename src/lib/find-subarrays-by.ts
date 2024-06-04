const findSubarraysBy = <T>(
  arr: Array<T>,
  windowSize: number,
  predicate: (subArr: Array<T>) => boolean
): Array<Array<T>> => {
  const subarrays: Array<Array<T>> = []

  for (let i = 0; i <= arr.length - windowSize; i++) {
    const subArray = arr.slice(i, i + windowSize)
    if (predicate(subArray)) {
      subarrays.push(subArray)
    }
  }
  return subarrays
}

export default findSubarraysBy
