import { experience } from '../../../data/resume'
import { cn } from '../../../lib/cn'
import { Tag } from '../../ui/Tag'

interface CareerPathProps {
  graduationYear: string
  /** Short degree label for the first stop, e.g. "B.S. Computer Science". */
  degree: string
}

interface Stop {
  key: string
  date: string
  title: string
  place: string
  current: boolean
}

/** A compact, chronological timeline from graduation through every role in `experience`. */
export function CareerPath({ graduationYear, degree }: CareerPathProps) {
  const stops: Stop[] = [
    { key: 'graduation', date: graduationYear, title: degree, place: 'Graduated', current: false },
    ...[...experience].reverse().map((role) => ({
      key: `${role.company}-${role.start}`,
      date: role.start,
      title: role.title,
      place: role.company,
      current: role.current,
    })),
  ]

  return (
    <div>
      <p id="career-path-label" className="font-mono text-xs tracking-[0.16em] text-fg-subtle uppercase">
        Since graduation
      </p>
      <ol aria-labelledby="career-path-label" className="mt-6">
        {stops.map((stop, i) => {
          const isLast = i === stops.length - 1
          return (
            <li key={stop.key} className={cn('relative grid grid-cols-[4.5rem_1fr] gap-x-4', !isLast && 'pb-6')}>
              <span className="pt-px font-mono text-xs leading-5 text-fg-subtle tabular-nums">{stop.date}</span>
              <div className="relative min-w-0 pl-6">
                {/* Rail and node; the rail runs down to the next stop. */}
                <span aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px">
                  {!isLast ? <span className="absolute inset-x-0 top-2.5 -bottom-6 bg-line" /> : null}
                  <span
                    className={cn(
                      'absolute top-1.5 left-1/2 size-2.5 -translate-x-1/2 rounded-full border-2 ring-4 ring-surface-2',
                      stop.current ? 'border-accent bg-accent' : 'border-line-strong bg-surface',
                    )}
                  />
                </span>
                <p className="text-sm leading-5 font-medium text-fg">{stop.title}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-fg-muted">
                  {stop.place}
                  {stop.current ? <Tag tone="accent">Current</Tag> : null}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
