import { describe, expect, it } from 'vitest'
import { toDateTime } from './dates'

describe('toDateTime', () => {
  it('turns a month and year label into YYYY-MM', () => {
    expect(toDateTime('Jun 2024')).toBe('2024-06')
    expect(toDateTime('Oct 2022')).toBe('2022-10')
  })

  it('accepts long and abbreviated month names', () => {
    expect(toDateTime('Sept 2023')).toBe('2023-09')
    expect(toDateTime('January 2020')).toBe('2020-01')
    expect(toDateTime('Dec. 2019')).toBe('2019-12')
  })

  it('returns undefined for labels that are not a month and year', () => {
    expect(toDateTime('Present')).toBeUndefined()
    expect(toDateTime('2024')).toBeUndefined()
    expect(toDateTime('Foo 2024')).toBeUndefined()
  })
})
