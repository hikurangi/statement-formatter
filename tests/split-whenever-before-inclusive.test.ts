import splitWheneverBeforeInclusive from '../src/lib/split-whenever-before-inclusive'

test('Splits as expected', () => {
  const list = [1, 5, 2, 2, 1, 1, 3, 1, 2, 1, 2]
  const predicate = (item: number) => item === 2

  const expected = [[1, 5], [2], [2, 1, 1, 3, 1], [2, 1], [2]]

  expect(splitWheneverBeforeInclusive(predicate, list)).toEqual(expected)
})
