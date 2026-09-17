import { GraduationCap } from 'lucide-react'
import type { Education } from '../../../data/resume'
import { cn } from '../../../lib/cn'
import { CareerPath } from './CareerPath'

interface EducationCardProps {
  entry: Education
  /** Adds the career timeline since graduation beside the degree; used for the most recent degree only. */
  showCareerPath: boolean
}

export function EducationCard({ entry, showCareerPath }: EducationCardProps) {
  const titleId = `education-${entry.year}-${entry.school.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  const facts = [
    { term: 'Degree', value: entry.degree },
    { term: 'Major', value: entry.field },
    { term: 'Graduated', value: entry.year },
  ]

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'grid overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-200 hover:border-line-strong',
        showCareerPath && 'lg:grid-cols-[1.1fr_1fr]',
      )}
    >
      <div className="flex flex-col p-6 sm:p-8 lg:p-10">
        <div className="flex items-start gap-4 sm:gap-5">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-xl border border-accent-line bg-accent-soft text-accent"
          >
            <GraduationCap className="size-6" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <h3 id={titleId} className="text-xl font-semibold tracking-tight text-balance text-fg sm:text-2xl">
              {entry.degreeName} in {entry.field}
            </h3>
            <p className="mt-1.5 text-base font-medium text-accent">{entry.school}</p>
          </div>
        </div>

        <dl className="mt-8 grid overflow-hidden rounded-xl border border-line sm:grid-cols-3 lg:mt-auto">
          {facts.map((fact, i) => (
            <div
              key={fact.term}
              className={cn(
                'flex items-baseline justify-between gap-4 bg-surface-2 px-4 py-3.5 sm:block',
                i > 0 && 'border-t border-line sm:border-t-0 sm:border-l',
              )}
            >
              <dt className="font-mono text-xs tracking-[0.16em] text-fg-subtle uppercase">{fact.term}</dt>
              <dd className="text-sm font-medium text-fg sm:mt-1.5">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {showCareerPath ? (
        <div className="border-t border-line bg-surface-2/50 p-6 sm:p-8 lg:border-t-0 lg:border-l lg:p-10">
          <CareerPath graduationYear={entry.year} degree={`${entry.degree} ${entry.field}`} />
        </div>
      ) : null}
    </article>
  )
}
