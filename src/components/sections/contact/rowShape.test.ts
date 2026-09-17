import { describe, expect, it } from 'vitest'
import { rowShape } from './rowShape'

describe('rowShape', () => {
  it('rounds all corners of a single row', () => {
    expect(rowShape(0, 1)).toBe('rounded-[15px]')
  })

  it('rounds only the outer corners of two rows', () => {
    expect(rowShape(0, 2)).toBe('rounded-t-[15px] rounded-b-none')
    expect(rowShape(1, 2)).toBe('rounded-t-none rounded-b-[15px]')
  })

  it('leaves middle rows square', () => {
    expect(rowShape(0, 3)).toBe('rounded-t-[15px] rounded-b-none')
    expect(rowShape(1, 3)).toBe('rounded-none')
    expect(rowShape(2, 3)).toBe('rounded-t-none rounded-b-[15px]')
  })
})
