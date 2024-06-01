const splitWheneverInclusive = <T>(
  predicate: (item: T) => boolean,
  array: Array<T>
): Array<Array<T>> => {
  // This devastatingly simple and straightforward solution brought to you by 4o
  // https://chatgpt.com/share/1fec560e-eab4-408b-91f8-625cec3106ad
  const result: Array<Array<T>> = []
  let currentArray: Array<T> = []

  for (const item of array) {
    currentArray.push(item)
    if (predicate(item)) {
      result.push(currentArray)
      currentArray = []
    }
  }

  // If there are any remaining items in currentArray, add them as the last subarray
  if (currentArray.length > 0) {
    result.push(currentArray)
  }

  return result
}

export default splitWheneverInclusive
