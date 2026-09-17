import { ArrowRight, Database, RotateCcw } from 'lucide-react'
import { m, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../../../lib/cn'
import { EASE_OUT } from '../../../lib/motion'
import { PipelineStepRow } from './PipelineStepRow'
import { FINAL_PHASE, PIPELINE_STEPS, phaseDelay, stepState } from './pipeline'

const STEP_COUNT = PIPELINE_STEPS.length

/**
 * Illustrative product UI: an LLM response moving through retrieval, generation, validation, a confidence check
 * and human review before it is persisted. Plays once when scrolled into view, then holds its final state.
 */
export function GuardrailConsole() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState(-1)
  const [runs, setRuns] = useState(0)

  // Reduced motion: skip the sequence entirely and show the finished pipeline.
  const current = reduceMotion ? FINAL_PHASE : phase
  const finished = current >= FINAL_PHASE
  const persisting = current === STEP_COUNT
  const checked = Math.min(Math.max(current, 0), STEP_COUNT)

  useEffect(() => {
    if (reduceMotion || !inView || phase >= FINAL_PHASE) return
    const timer = window.setTimeout(() => setPhase((p) => p + 1), phaseDelay(phase, runs > 0))
    return () => window.clearTimeout(timer)
  }, [phase, inView, reduceMotion, runs])

  const replay = () => {
    if (!finished) return
    setRuns((n) => n + 1)
    setPhase(-1)
  }

  // Once the first run has finished, keep the button mounted (disabled while replaying) so focus is never lost.
  const showReplay = !reduceMotion && (finished || runs > 0)

  return (
    <figure ref={ref} className="relative">
      <div className="@container overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <div aria-hidden="true" className="flex h-11 items-center gap-3 border-b border-line px-4 @sm:px-5">
          <span className="flex shrink-0 gap-1.5">
            <span className="size-2 rounded-full bg-line-strong" />
            <span className="size-2 rounded-full bg-line-strong" />
            <span className="size-2 rounded-full bg-line-strong" />
          </span>
          <span className="min-w-0 truncate font-mono text-xs text-fg-subtle">llm-output · guardrails</span>
          <span className="ml-auto shrink-0 rounded-md border border-line bg-surface-2 px-1.5 font-mono text-[11px] leading-5 text-fg-muted tabular-nums">
            {checked}/{STEP_COUNT}
            <span className="hidden @[22rem]:inline"> steps</span>
          </span>
        </div>

        <ol aria-hidden="true" className="px-4 py-6 @sm:px-6 @sm:py-7">
          {PIPELINE_STEPS.map((step, index) => (
            <PipelineStepRow
              key={step.label}
              step={step}
              state={stepState(index, current, step.outcome)}
              isLast={index === STEP_COUNT - 1}
            />
          ))}
        </ol>

        <div className="flex h-12 items-center gap-3 border-t border-line bg-surface-2/60 px-4 @sm:px-5">
          <span aria-hidden="true" className="flex min-w-0 items-center gap-2 font-mono text-xs text-fg-muted">
            <Database className="size-3.5 shrink-0 text-fg-subtle" />
            <span className="truncate">
              {/* An icon, not U+2192: Geist Mono's shipped subsets lack that glyph. */}
              persist <ArrowRight aria-hidden="true" className="inline size-3 text-fg-subtle" /> database
            </span>
          </span>

          <span className="ml-auto flex shrink-0 items-center gap-1.5">
            {showReplay ? (
              <button
                type="button"
                onClick={replay}
                aria-label="Replay animation"
                aria-disabled={!finished}
                title="Replay"
                className={cn(
                  // The ::after layer grows the 28px button to a 40px hit area without changing the layout.
                  'relative inline-flex size-7 items-center justify-center rounded-md text-fg-subtle transition-colors duration-200 after:absolute after:-inset-1.5',
                  finished ? 'cursor-pointer hover:bg-line hover:text-fg' : 'cursor-default opacity-40',
                )}
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
              </button>
            ) : null}
            <PersistStatus finished={finished} persisting={persisting} />
          </span>
        </div>
      </div>

      <figcaption className="sr-only">
        Illustration: an LLM response passes retrieval, generation, and schema validation; a low-confidence field is
        flagged and routed to human review, then approved and saved.
      </figcaption>
    </figure>
  )
}

function PersistStatus({ finished, persisting }: { finished: boolean; persisting: boolean }) {
  const base =
    'inline-flex h-5 min-w-[4.25rem] items-center justify-center gap-1.5 rounded-md border px-1.5 font-mono text-[11px]'

  if (finished) {
    return (
      <m.span
        aria-hidden="true"
        className={cn(base, 'border-accent-line bg-accent-soft text-accent')}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
      >
        passed
      </m.span>
    )
  }

  return (
    <span aria-hidden="true" className={cn(base, 'border-line bg-surface', persisting ? 'text-accent' : 'text-fg-subtle')}>
      {persisting ? <span className="size-1.5 animate-pulse rounded-full bg-accent" /> : null}
      {persisting ? 'writing' : 'waiting'}
    </span>
  )
}
