import { describe, expect, it } from 'vitest'
import { staggerDelay } from './motion'

describe('staggerDelay', () => {
  it('steps 0.06s per item and caps at 0.3s', () => {
    expect(staggerDelay(0)).toBe(0)
    expect(staggerDelay(2)).toBeCloseTo(0.12)
    expect(staggerDelay(5)).toBeCloseTo(0.3)
    expect(staggerDelay(20)).toBe(0.3)
  })

  it('accepts a custom step and cap', () => {
    expect(staggerDelay(3, 0.1, 0.25)).toBe(0.25)
    expect(staggerDelay(1, 0.1, 0.25)).toBeCloseTo(0.1)
  })
})
