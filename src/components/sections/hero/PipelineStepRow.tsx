import { CircleCheck, TriangleAlert } from 'lucide-react'
import { m } from 'motion/react'
import { cn } from '../../../lib/cn'
import { EASE_OUT } from '../../../lib/motion'
import type { PipelineStep, StepState } from './pipeline'

interface PipelineStepRowProps {
  step: PipelineStep
  state: StepState
  isLast: boolean
}

/** One check in the guardrail console: status icon, label and detail, and a mono result on the right. */
export function PipelineStepRow({ step, state, isLast }: PipelineStepRowProps) {
  const resolved = state === 'pass' || state === 'warn'

  return (
    <li className={cn('relative flex items-start gap-3', !isLast && 'pb-5')}>
      {isLast ? null : (
        <span className="absolute top-7 bottom-1 left-[11.5px] w-px overflow-hidden bg-line">
          <m.span
            className="absolute inset-0 origin-top bg-accent-line"
            initial={false}
            animate={{ scaleY: resolved ? 1 : 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          />
        </span>
      )}

      <StatusIcon state={state} />

      {/* Pending steps are muted with color, not opacity, so the text keeps AA contrast. */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm leading-6 transition-colors duration-300',
            state === 'pending' ? 'text-fg-muted' : 'text-fg',
          )}
        >
          {step.label}
        </p>
        <p className="font-mono text-xs leading-5 text-fg-subtle">{step.detail}</p>
      </div>

      <StepResult step={step} state={state} />
    </li>
  )
}

function StatusIcon({ state }: { state: StepState }) {
  return (
    <span className="relative flex size-6 shrink-0 items-center justify-center rounded-full bg-surface">
      <m.span
        key={state}
        className="flex items-center justify-center"
        initial={state === 'pending' ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
      >
        {state === 'pending' ? (
          <span className="block size-[17px] rounded-full border border-dashed border-line-strong" />
        ) : null}
        {state === 'running' ? (
          <span className="flex size-[17px] items-center justify-center rounded-full border border-accent-line bg-accent-soft">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
          </span>
        ) : null}
        {state === 'pass' ? <CircleCheck className="size-5 text-accent" strokeWidth={1.75} /> : null}
        {state === 'warn' ? <TriangleAlert className="size-5 text-warn" strokeWidth={1.75} /> : null}
      </m.span>
    </span>
  )
}

const plainResult = 'font-mono text-[11px] leading-6 whitespace-nowrap'

function StepResult({ step, state }: { step: PipelineStep; state: StepState }) {
  const resolved = state === 'pass' || state === 'warn'
  const interim = state === 'running' ? (
    <span className={cn(plainResult, 'text-accent')}>running</span>
  ) : (
    <span className={cn(plainResult, 'text-fg-subtle')}>queued</span>
  )

  // Quiet results are hidden in narrow cards to give labels room; highlighted chips always keep their slot.
  if (step.resultStyle === 'plain') {
    return (
      <span className="hidden w-[4.25rem] shrink-0 justify-end @sm:flex">
        {resolved ? <span className={cn(plainResult, 'text-fg-subtle')}>{step.result}</span> : interim}
      </span>
    )
  }

  return (
    <span className="flex w-[4.25rem] shrink-0 justify-end pt-0.5">
      {resolved ? (
        <m.span
          className={cn(
            'rounded-md border px-1.5 font-mono text-[11px] leading-[18px] whitespace-nowrap',
            state === 'warn' ? 'border-warn/30 bg-warn-soft text-warn' : 'border-accent-line bg-accent-soft text-accent',
          )}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          {step.result}
        </m.span>
      ) : (
        <span className="-mt-0.5 hidden @sm:flex">{interim}</span>
      )}
    </span>
  )
}
