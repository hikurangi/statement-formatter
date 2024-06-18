import { isEmpty, head, tail, splitWhen } from 'ramda'

// Splits an array into subarrays at each element that
// satisfies the predicate, including the matching element
// at the start of the new subarray
const splitWheneverBeforeInclusive = <T>(
  predicate: (item: T) => boolean,
  arr: Array<T>
): Array<Array<T>> => {
  if (isEmpty(arr)) return []

  const first = head(arr) as T
  const rest = tail(arr) as Array<T>

  if (predicate(first)) {
    const [group, remaining] = splitWhen(predicate, rest)
    return [
      [first, ...group],
      ...splitWheneverBeforeInclusive(predicate, remaining),
    ]
  }

  const [group, remaining] = splitWhen(predicate, arr)
  return [group, ...splitWheneverBeforeInclusive(predicate, remaining)]
}

export default splitWheneverBeforeInclusive
