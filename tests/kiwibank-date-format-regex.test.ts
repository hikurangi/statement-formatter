import { describe, test } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { KIWIBANK_DATE_FORMAT } from '../src/lib/kiwibank-date-format-regex.ts'

const generateRangeOfFormattedDates = (
  startDate: Date,
  endDate: Date
): Array<string> => {
  const dates: Array<string> = []
  const formatter = new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
  })

  const currentDate = new Date(startDate)

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

  for (const validDay of allValidDays) {
    test(`'${validDay}' should be valid`, () => {
      expect(KIWIBANK_DATE_FORMAT.test(validDay)).toEqual(true)
    })
  }

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

  for (const invalidDay of someInvalidDays) {
    test(`'${invalidDay}' should not be valid`, () => {
      expect(KIWIBANK_DATE_FORMAT.test(invalidDay)).toEqual(false)
    })
  }
})
