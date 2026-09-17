/**
 * Script for the hero's illustrative guardrail console. This is UI microcopy describing the kind of pipeline
 * on the resume (retrieval, generation, schema validation, confidence scoring, human review routing); it is not a
 * metric claim.
 */

export type StepOutcome = 'pass' | 'warn'
export type StepState = 'pending' | 'running' | StepOutcome

export interface PipelineStep {
  label: string
  detail: string
  outcome: StepOutcome
  /** Short mono result shown on the right once the step resolves. */
  result: string
  /** "chip" highlights the result (warn or accent tint); "plain" keeps it quiet. */
  resultStyle: 'plain' | 'chip'
  /** How long the step shows as running before it resolves, in ms. */
  duration: number
}

export const PIPELINE_STEPS: readonly PipelineStep[] = [
  {
    label: 'Retrieve context',
    detail: 'grounded in source documents',
    outcome: 'pass',
    result: 'pass',
    resultStyle: 'plain',
    duration: 750,
  },
  {
    label: 'Generate response',
    detail: 'task-specific model',
    outcome: 'pass',
    result: 'pass',
    resultStyle: 'plain',
    duration: 900,
  },
  {
    label: 'Validate JSON schema',
    detail: 'field-level validation',
    outcome: 'pass',
    result: 'pass',
    resultStyle: 'plain',
    duration: 700,
  },
  {
    label: 'Score field confidence',
    detail: 'low-confidence field',
    outcome: 'warn',
    result: 'flagged',
    resultStyle: 'chip',
    duration: 950,
  },
  {
    label: 'Human-in-the-loop review',
    detail: 'routed · approved',
    outcome: 'pass',
    result: 'approved',
    resultStyle: 'chip',
    duration: 900,
  },
]

/** Pause before the first step starts, so the hero text settles first. */
export const START_DELAY_MS = 700
/** Shorter pause when the visitor replays the sequence. */
export const REPLAY_DELAY_MS = 250
/** How long the final "persist" stage runs after the last check. */
export const PERSIST_DURATION_MS = 650

/**
 * Phases: -1 = nothing started, 0..n-1 = step i running, n = persisting, n + 1 = finished.
 */
export const FINAL_PHASE = PIPELINE_STEPS.length + 1

export function stepState(index: number, phase: number, outcome: StepOutcome): StepState {
  if (index < phase) return outcome
  if (index === phase) return 'running'
  return 'pending'
}

/** Delay before advancing from `phase` to the next phase. */
export function phaseDelay(phase: number, isReplay: boolean): number {
  if (phase < 0) return isReplay ? REPLAY_DELAY_MS : START_DELAY_MS
  return PIPELINE_STEPS[phase]?.duration ?? PERSIST_DURATION_MS
}
