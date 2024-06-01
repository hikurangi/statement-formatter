// from Ramda splitWhen
// https://github.com/ramda/ramda/blob/v0.30.0/source/splitWhen.js
const splitWheneverInclusive = <T>(
  pred: (item: T) => boolean,
  list: Array<T>
) => {
  var acc = []
  var curr = []
  for (var i = 0; i < list.length; i = i + 1) {
    if (!pred(list[i])) {
      // if the current list item does not satisfy the predicate
      curr.push(list[i])
    }

    const nextItem = list[i + 1]

    if (
      ((i < list.length - 1 && pred(nextItem)) || i === list.length - 1) &&
      curr.length > 0
    ) {
      if (typeof nextItem !== 'undefined') {
        // this is the inclusive addition
        acc.push([...curr, list[i + 1]])
      }
      curr = []
    }
  }
  return acc
}

export default splitWheneverInclusive
