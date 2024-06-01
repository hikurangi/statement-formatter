// from Ramda splitWhenever
// https://github.com/ramda/ramda/blob/v0.30.0/source/splitWhenever.js
import { append, head, splitWhen, tail } from 'ramda'

const splitter = <T>(
  acc: Array<Array<T>>,
  targetList: Array<T>,
  pred: (item: T) => boolean
): Array<Array<T>> => {
  if (targetList.length === 0) {
    return acc
  }

  // iterate thru the target list, up to where the predicate is satisfied
  const [currentChunkExclusive, remainingList] = splitWhen(pred, targetList)
  if (remainingList.length === 0) {
    return append(currentChunkExclusive, acc)
  }

  const currentChunkInclusive = append(
    head(remainingList)!,
    currentChunkExclusive
  )

  return splitter(append(currentChunkInclusive, acc), tail(remainingList), pred)
}
const splitWheneverInclusive = <T>(
  pred: (item: T) => boolean,
  list: Array<T>
): Array<Array<T>> => {
  return splitter([], list, pred)
}

export default splitWheneverInclusive
