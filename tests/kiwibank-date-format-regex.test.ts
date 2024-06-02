import KIWIBANK_DATE_FORMAT_REGEX from '../src/lib/kiwibank-date-format-regex'

const generateRangeOfFormattedDates = (
  startDate: Date,
  endDate: Date
): Array<string> => {
  const dates: Array<string> = []
  const formatter = new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
  })

  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const formattedDate = formatter.format(currentDate)
    const [month, day] = formattedDate.split(' ')
    const formattedDateReverse = `${day} ${month}`
    dates.push(formattedDateReverse)
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

describe('Date format regex', () => {
  const allValidDays = generateRangeOfFormattedDates(
    new Date('2024-01-01'),
    new Date('2024-12-31')
  )

  test.each(allValidDays)('%i should be valid', date => {
    expect(KIWIBANK_DATE_FORMAT_REGEX.test(date)).toEqual(true)
  })

  const invalidDays = ['30 Feb', '31 Sep', '32 May', '11 Noy']

  test.each(invalidDays)('%i should not be valid', date => {
    expect(KIWIBANK_DATE_FORMAT_REGEX.test(date)).toEqual(false)
  })
})
