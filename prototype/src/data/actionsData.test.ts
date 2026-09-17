import { describe, expect, it } from 'vitest'
import { getActionDeadline, getActionState } from './actionsData'

describe('action deadline', () => {
  const today = new Date('2026-09-17T12:00:00')
  it.each([
    ['2026-12-31', 'До 31 декабря 2026 года'],
    ['2026-09-24', 'До конца акции осталось 7 дней'],
    ['2026-09-20', 'До конца акции осталось 3 дня'],
    ['2026-09-18', 'До конца акции остался 1 день'],
    ['2026-09-17', 'Последний день акции'],
  ])('formats %s from dates', (endDate, expected) => {
    expect(getActionDeadline(endDate, today)).toBe(expected)
  })

  it.each([
    ['2026-09-09', '2026-09-10', 'scheduled'],
    ['2026-09-10', '2026-09-10', 'active'],
    ['2026-09-20', '2026-09-20', 'active'],
    ['2026-09-21', '2026-09-20', 'completed'],
  ])('classifies %s against boundary %s', (now, boundary, expected) => {
    expect(getActionState({ startDate: '2026-09-10', endDate: boundary }, new Date(`${now}T12:00:00`))).toBe(expected)
  })
})
