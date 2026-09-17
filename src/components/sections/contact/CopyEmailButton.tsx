import { Check, CircleAlert, Copy, type LucideIcon } from 'lucide-react'
import { m } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../../../lib/cn'
import { EASE_OUT } from '../../../lib/motion'
import { buttonClasses } from '../../ui/buttonClasses'
import { copyText } from './copyText'

type CopyStatus = 'idle' | 'copied' | 'failed'

interface CopyEmailButtonProps {
  email: string
  className?: string
}

const RESET_AFTER_MS = 2000
const STATUSES: readonly CopyStatus[] = ['idle', 'copied', 'failed']

const LABELS: Record<CopyStatus, string> = {
  idle: 'Copy email',
  copied: 'Copied',
  failed: 'Copy failed',
}

const ICONS: Record<CopyStatus, LucideIcon> = {
  idle: Copy,
  copied: Check,
  failed: CircleAlert,
}

/** Copies the email address and confirms it inline for two seconds, with a polite screen reader announcement. */
export function CopyEmailButton({ email, className }: CopyEmailButtonProps) {
  const [status, setStatus] = useState<CopyStatus>('idle')
  // Counts copy attempts; keying on it re-announces (and re-animates) a repeat copy while the status is unchanged.
  const [attempt, setAttempt] = useState(0)
  const timeoutRef = useRef<number | null>(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  async function handleCopy() {
    const copied = await copyText(email)
    if (!mountedRef.current) return

    setAttempt((n) => n + 1)
    setStatus(copied ? 'copied' : 'failed')
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null
      setStatus('idle')
    }, RESET_AFTER_MS)
  }

  const Icon = ICONS[status]
  const announcement =
    status === 'copied'
      ? 'Email address copied to clipboard.'
      : status === 'failed'
        ? `Could not copy automatically. The email address is ${email}.`
        : ''

  return (
    <>
      <button type="button" onClick={handleCopy} className={buttonClasses('secondary', 'md', className)}>
        <m.span
          key={`${status}-${attempt}`}
          className="inline-flex"
          initial={attempt > 0 ? { opacity: 0, scale: 0.6 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
        >
          <Icon aria-hidden="true" className={cn(status === 'copied' && 'text-accent')} />
        </m.span>
        {/* All labels share one grid cell so the button keeps a stable width as the label changes. */}
        <span className="grid text-left">
          {STATUSES.map((option) => (
            <span
              key={option}
              aria-hidden={option === status ? undefined : true}
              className={cn('col-start-1 row-start-1', option !== status && 'invisible')}
            >
              {LABELS[option]}
            </span>
          ))}
        </span>
      </button>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        <span key={attempt}>{announcement}</span>
      </span>
    </>
  )
}
