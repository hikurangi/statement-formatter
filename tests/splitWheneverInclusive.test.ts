import splitWheneverInclusive from '../lib/splitWheneverInclusive'

test('Splits as expected', () => {
  const list = [1, 5, 2, 2, 1, 1, 3, 1, 2, 1, 2]
  const expected = [[1, 5, 2], [2], [1, 1, 3, 1, 2], [1, 2]]
  const predicate = (item: number) => item === 2

  expect(splitWheneverInclusive(predicate, list)).toEqual(expected)
})
