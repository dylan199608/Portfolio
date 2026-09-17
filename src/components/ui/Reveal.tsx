import { m } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE_OUT } from '../../lib/motion'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Seconds to wait before animating; stagger siblings with `staggerDelay(i)` from lib/motion. */
  delay?: number
}

/**
 * Fades content up into place the first time it scrolls into view.
 * Transforms are disabled for reduced-motion users via <MotionConfig reducedMotion="user"> in App.
 * Uses the lightweight `m` component, so it must render inside App's <LazyMotion>.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -64px 0px' }}
      transition={{ duration: 0.55, ease: EASE_OUT, delay }}
    >
      {children}
    </m.div>
  )
}
