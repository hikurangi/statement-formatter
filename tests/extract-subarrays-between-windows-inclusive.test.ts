import { equals } from 'ramda'
import extractSubarraysBetweenWindowsInclusive from '../src/lib/extract-subarrays-between-windows-inclusive'

const startWindow = ['this', 'is', 'the', 'start', 'window', "i'm", 'serious']
const isStartWindow = (window: Array<any>) => equals(window, startWindow)
const endWindow = ['this', 'is', 'the', 'end', 'window']
const isEndWindow = (window: Array<any>) => equals(window, endWindow)

describe('extract subarrays between windows', () => {
  test('works for one subarray', () => {
    const subarrayBetweenWindows = [
      'we',
      'also',
      'want',
      'these',
      'between',
      'words',
      'and',
    ]
    const input = [
      'here',
      'are',
      'some',
      'words',
      ...startWindow,
      ...subarrayBetweenWindows,
      ...endWindow,
      'and',
      'a',
      'couple',
      'to',
      'finish',
    ]
    const expected = [[...startWindow, ...subarrayBetweenWindows, ...endWindow]]
    const actual = extractSubarraysBetweenWindowsInclusive(
      {
        startWindowSize: 7,
        endWindowSize: 5,
        isStartWindow,
        isEndWindow,
      },
      input
    )

    expect(actual).toStrictEqual(expected)
  })

  test('works for multiple subarrays', () => {
    const subarray1 = ['we', 'also', 'want', 'these', 'between', 'words', 'and']

    const subarray2 = ['how', 'about', 'these']
    const subarray3 = ['and', 'these', 'gosh', 'darnit']
    const input = [
      'here',
      'are',
      'some',
      'words',
      ...startWindow,
      ...subarray1,
      ...endWindow,
      ...subarray2,
      ...startWindow,
      ...subarray3,
      ...endWindow,
      'and',
      'a',
      'couple',
      'to',
      'finish',
    ]
    const expected = [
      [...startWindow, ...subarray1, ...endWindow],
      [...startWindow, ...subarray3, ...endWindow],
    ]
    const actual = extractSubarraysBetweenWindowsInclusive(
      {
        startWindowSize: 7,
        endWindowSize: 5,
        isStartWindow,
        isEndWindow,
      },
      input
    )

    expect(actual).toStrictEqual(expected)
  })
})
