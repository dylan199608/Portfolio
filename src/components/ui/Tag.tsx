import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface TagProps {
  children: ReactNode
  className?: string
  /** "accent" highlights a tag, e.g. on the current role. */
  tone?: 'neutral' | 'accent'
}

export function Tag({ children, className, tone = 'neutral' }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] leading-5 whitespace-nowrap',
        tone === 'accent' ? 'border-accent-line bg-accent-soft text-accent' : 'border-line bg-surface-2 text-fg-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}
