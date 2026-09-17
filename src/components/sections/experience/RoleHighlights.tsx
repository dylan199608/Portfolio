import { ChevronDown } from 'lucide-react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../../lib/cn'
import { EASE_OUT } from '../../../lib/motion'
import { buttonClasses } from '../../ui/buttonClasses'

/** Highlights shown before the "Show more" disclosure. */
const VISIBLE_COUNT = 3
/** Collapse animation length in milliseconds (matches `transition` below). */
const COLLAPSE_MS = 400
/** Height of the fixed navbar (h-16). */
const HEADER_HEIGHT = 64

/**
 * Scrolls the window on every frame for `durationMs` so `element` keeps its current position in the viewport
 * while content above it shrinks. Stops early if the user scrolls with a wheel or touch. Returns a stop function.
 */
function holdInViewport(element: HTMLElement, durationMs: number): () => void {
  const anchorTop = element.getBoundingClientRect().top
  const until = performance.now() + durationMs
  let frame = 0

  const stop = () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('wheel', stop)
    window.removeEventListener('touchmove', stop)
  }
  const hold = () => {
    const drift = element.getBoundingClientRect().top - anchorTop
    if (Math.abs(drift) >= 0.5) window.scrollBy({ top: drift, behavior: 'instant' })
    if (performance.now() < until) frame = requestAnimationFrame(hold)
    else stop()
  }

  window.addEventListener('wheel', stop, { passive: true })
  window.addEventListener('touchmove', stop, { passive: true })
  frame = requestAnimationFrame(hold)
  return stop
}

/** Bullet text with a small dot centered on the first line (line-height 1.625 → half-leading at 0.8125em). */
function Bullet({ children }: { children: ReactNode }) {
  return (
    <span className="relative block pl-5 text-pretty">
      <span
        aria-hidden="true"
        className="absolute top-[calc(0.8125em_-_3px)] left-0.5 size-1.5 rounded-full bg-line-strong"
      />
      {children}
    </span>
  )
}

interface RoleHighlightsProps {
  highlights: string[]
  /** Gives the disclosure button context for screen readers, e.g. "Senior AI Engineer at Akveo". */
  roleLabel: string
  className?: string
}

export function RoleHighlights({ highlights, roleLabel, className }: RoleHighlightsProps) {
  const [expanded, setExpanded] = useState(false)
  const listId = useId()
  const reduceMotion = useReducedMotion()
  const listRef = useRef<HTMLUListElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const stopHoldRef = useRef<(() => void) | null>(null)

  useEffect(() => () => stopHoldRef.current?.(), [])

  const visible = highlights.slice(0, VISIBLE_COUNT)
  const extra = highlights.slice(VISIBLE_COUNT)
  const transition = reduceMotion ? { duration: 0 } : { duration: COLLAPSE_MS / 1000, ease: EASE_OUT }

  function toggle() {
    const list = listRef.current
    const button = buttonRef.current
    // "Show less" sits below the list. If the list starts under the header, collapsing it would pull the focused
    // button off-screen and slide the next role's "Show more" into its place, so keep the button where it is.
    if (expanded && list && button && list.getBoundingClientRect().top < HEADER_HEIGHT) {
      stopHoldRef.current?.()
      stopHoldRef.current = holdInViewport(button, (reduceMotion ? 0 : COLLAPSE_MS) + 150)
    }
    setExpanded((value) => !value)
  }

  return (
    <div className={className}>
      <ul ref={listRef} id={listId} className="text-sm leading-relaxed text-fg-muted sm:text-[15px]">
        {visible.map((highlight, i) => (
          <li key={highlight} className={cn(i > 0 && 'mt-3')}>
            <Bullet>{highlight}</Bullet>
          </li>
        ))}
        <AnimatePresence initial={false}>
          {expanded
            ? extra.map((highlight) => (
                <m.li
                  key={highlight}
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={transition}
                >
                  {/* Spacing lives inside the animated box so the collapse has no jump. */}
                  <div className="pt-3">
                    <Bullet>{highlight}</Bullet>
                  </div>
                </m.li>
              ))
            : null}
        </AnimatePresence>
      </ul>

      {extra.length > 0 ? (
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={toggle}
          // The pseudo-element extends the hit area to 40px tall without changing the layout.
          className={buttonClasses('ghost', 'sm', 'relative mt-4 -ml-3 after:absolute after:inset-x-0 after:-inset-y-1')}
        >
          {expanded ? 'Show less' : `Show ${extra.length} more`}
          <span className="sr-only">{expanded ? `, ${roleLabel}` : ` highlights, ${roleLabel}`}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'transition-transform duration-300 ease-out motion-reduce:transition-none',
              expanded && 'rotate-180',
            )}
          />
        </button>
      ) : null}
    </div>
  )
}
