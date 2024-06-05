import { KIWIBANK_DATE_FORMAT } from '../src/lib/kiwibank-date-format-regex'

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

  test.each(allValidDays)("'%s' should be valid", date => {
    expect(KIWIBANK_DATE_FORMAT.test(date)).toEqual(true)
  })

  const someInvalidDays = [
    '30 Feb',
    '31 Sep',
    '32 May',
    '11 Noy',
    '14 March',
    '14 Marc',
    '09 April',
    '31 August',
    '13 Februar',
  ]

  test.each(someInvalidDays)("'%s' should not be valid", date => {
    expect(KIWIBANK_DATE_FORMAT.test(date)).toEqual(false)
  })
})
