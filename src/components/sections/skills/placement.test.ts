import { describe, expect, it } from 'vitest'
import { placement } from './placement'

/** Grid cells a card covers in the 3-column (lg) layout. */
function lgCells(index: number, total: number): number {
  if (index === 0) return 4
  const classes = placement(index, total) ?? ''
  if (classes.includes('lg:col-span-3')) return 3
  if (classes.includes('lg:col-span-2') || classes.includes('md:col-span-2')) return 2
  return 1
}

/** Grid cells a card covers in the 2-column (md) layout. */
function mdCells(index: number, total: number): number {
  return placement(index, total)?.includes('md:col-span-2') ? 2 : 1
}

function sum(total: number, cells: (index: number, total: number) => number): number {
  return Array.from({ length: total }, (_, index) => cells(index, total)).reduce((a, b) => a + b, 0)
}

describe('placement', () => {
  it('makes the featured card a full md row and a 2×2 lg block', () => {
    expect(placement(0, 7)).toBe('md:col-span-2 lg:row-span-2')
    expect(placement(1, 7)).toBeUndefined()
    expect(placement(2, 7)).toBeUndefined()
  })

  it('alternates narrow and wide cards after the featured block', () => {
    expect(placement(3, 7)).toBeUndefined()
    expect(placement(4, 7)).toBe('lg:col-span-2')
    expect(placement(5, 7)).toBeUndefined()
    expect(placement(6, 7)).toBe('lg:col-span-2')
  })

  it('spans an unpaired last card across the full row', () => {
    expect(placement(5, 6)).toBe('md:col-span-2 lg:col-span-3')
  })

  it.each([3, 4, 5, 6, 7, 8, 9])('closes every row flush with %i groups', (total) => {
    expect(sum(total, lgCells) % 3).toBe(0)
    expect(sum(total, mdCells) % 2).toBe(0)
  })
})
