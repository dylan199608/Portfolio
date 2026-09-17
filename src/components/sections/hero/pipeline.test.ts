import { describe, expect, it } from 'vitest'
import {
  FINAL_PHASE,
  PERSIST_DURATION_MS,
  PIPELINE_STEPS,
  phaseDelay,
  REPLAY_DELAY_MS,
  START_DELAY_MS,
  stepState,
} from './pipeline'

describe('stepState', () => {
  it('is pending before its phase, running during it, and resolved to its outcome after', () => {
    expect(stepState(0, -1, 'pass')).toBe('pending')
    expect(stepState(2, 1, 'pass')).toBe('pending')
    expect(stepState(0, 0, 'pass')).toBe('running')
    expect(stepState(0, 1, 'pass')).toBe('pass')
    expect(stepState(0, 1, 'warn')).toBe('warn')
  })

  it('resolves every step once the sequence has finished', () => {
    PIPELINE_STEPS.forEach((step, index) => {
      expect(stepState(index, FINAL_PHASE, step.outcome)).toBe(step.outcome)
    })
  })
})

describe('phaseDelay', () => {
  it('waits longer before the first run than before a replay', () => {
    expect(phaseDelay(-1, false)).toBe(START_DELAY_MS)
    expect(phaseDelay(-1, true)).toBe(REPLAY_DELAY_MS)
  })

  it("uses each step's own duration while it runs", () => {
    PIPELINE_STEPS.forEach((step, index) => {
      expect(phaseDelay(index, false)).toBe(step.duration)
    })
  })

  it('holds the persist stage after the last step', () => {
    expect(phaseDelay(PIPELINE_STEPS.length, false)).toBe(PERSIST_DURATION_MS)
    expect(FINAL_PHASE).toBe(PIPELINE_STEPS.length + 1)
  })
})
