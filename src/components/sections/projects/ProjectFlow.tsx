import { ShieldCheck } from 'lucide-react'
import { m, useReducedMotion, type Variants } from 'motion/react'
import type { Project } from '../../../data/resume'
import { cn } from '../../../lib/cn'
import { EASE_OUT } from '../../../lib/motion'

interface ProjectFlowProps {
  /** Project title, used to label the flow for assistive tech. */
  title: string
  steps: Project['flow']
}

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT, delay: 0.1 + i * 0.07 },
  }),
}

/**
 * A system flow drawn as an ordered list: each stage is a node, joined by arrow connectors.
 * Check stages are tinted with the accent and marked with a shield so the "checks" in each system stand out.
 */
export function ProjectFlow({ title, steps }: ProjectFlowProps) {
  const reduceMotion = useReducedMotion()
  const animate = !reduceMotion

  return (
    <div className="relative mx-auto w-full max-w-xs">
      <div
        aria-hidden="true"
        className="mb-5 flex items-center justify-between gap-4 font-mono text-[11px] tracking-[0.16em] text-fg-subtle uppercase"
      >
        <span>System flow</span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-accent" strokeWidth={1.75} />
          Check step
        </span>
      </div>

      <m.ol
        aria-label={`${title} system flow`}
        className="flex flex-col"
        initial={animate ? 'hidden' : undefined}
        whileInView={animate ? 'visible' : undefined}
        viewport={{ once: true, amount: 0.3 }}
      >
        {steps.map((step, i) => {
          const isCheck = step.check === true
          const isLast = i === steps.length - 1

          return (
            <m.li key={`${i}-${step.label}`} custom={i} variants={stepVariants}>
              {i > 0 ? <Connector /> : null}
              <div
                className={cn(
                  'relative flex items-center gap-3 rounded-lg border px-3 py-1.5 text-sm leading-5 text-fg',
                  isCheck
                    ? 'border-accent-line bg-surface bg-linear-to-b from-accent-soft to-accent-soft'
                    : isLast
                      ? 'border-line-strong bg-surface shadow-card'
                      : 'border-line bg-surface',
                  isLast && 'font-medium',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn('font-mono text-[10px] tabular-nums', isCheck ? 'text-accent' : 'text-fg-subtle')}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  {step.label}
                  {isCheck ? <span className="sr-only"> (check step)</span> : null}
                </span>
                {isCheck ? (
                  <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0 text-accent" strokeWidth={1.75} />
                ) : null}
              </div>
            </m.li>
          )
        })}
      </m.ol>
    </div>
  )
}

/** Short vertical arrow between two nodes. */
function Connector() {
  return (
    <span aria-hidden="true" className="flex h-5 justify-center text-fg-subtle">
      <svg
        viewBox="0 0 10 20"
        className="h-5 w-2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 3v13.5" opacity={0.55} />
        <path d="M2.75 14.5 5 17l2.25-2.5" />
      </svg>
    </span>
  )
}
