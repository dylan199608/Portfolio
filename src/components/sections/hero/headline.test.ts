import { describe, expect, it } from 'vitest'
import { splitHeadline } from './headline'

describe('splitHeadline', () => {
  it('splits at the spaced em dash into a lead and a tail', () => {
    expect(splitHeadline('I find where models get things wrong — and build the checks that catch it.')).toEqual([
      'I find where models get things wrong',
      'and build the checks that catch it.',
    ])
  })

  it('splits only at the first separator', () => {
    expect(splitHeadline('one — two — three')).toEqual(['one', 'two — three'])
  })

  it('returns the whole headline and a null tail without a separator', () => {
    expect(splitHeadline('Building LLM systems that get things right.')).toEqual([
      'Building LLM systems that get things right.',
      null,
    ])
  })

  it('ignores an unspaced em dash', () => {
    expect(splitHeadline('before—after')).toEqual(['before—after', null])
  })
})
