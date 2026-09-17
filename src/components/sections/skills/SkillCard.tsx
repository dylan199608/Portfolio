import { Cloud, CodeXml, Database, LayoutDashboard, Server, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react'
import { useId } from 'react'
import type { SkillGroup } from '../../../data/resume'
import { cn } from '../../../lib/cn'

interface SkillCardProps {
  group: SkillGroup
  /** The lead group: accent treatment, a focus label, and larger chips. */
  featured?: boolean
}

/** One icon per skill group id in resume.ts. */
const CATEGORY_ICONS: Record<SkillGroup['id'], LucideIcon> = {
  ai: Sparkles,
  languages: CodeXml,
  backend: Server,
  frontend: LayoutDashboard,
  data: Database,
  cloud: Cloud,
  practices: ShieldCheck,
}

export function SkillCard({ group, featured = false }: SkillCardProps) {
  const headingId = useId()
  const Icon = CATEGORY_ICONS[group.id]
  const count = String(group.skills.length).padStart(2, '0')

  return (
    <div
      className={cn(
        'relative isolate flex h-full flex-col overflow-hidden rounded-2xl border bg-surface transition-colors duration-200',
        featured
          ? 'border-accent-line bg-linear-to-br from-accent-soft to-transparent p-6 hover:border-accent/50'
          : 'border-line p-6 hover:border-line-strong',
      )}
    >
      {featured ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_60%)]"
        />
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              'grid size-9 shrink-0 place-items-center rounded-lg border',
              featured ? 'border-accent-line bg-accent-soft text-accent' : 'border-line bg-surface-2 text-fg-muted',
            )}
          >
            <Icon className="size-[18px]" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <h3
              id={headingId}
              className={cn('font-semibold tracking-tight text-fg', featured ? 'text-lg leading-6' : 'text-base')}
            >
              {group.category}
            </h3>
            {featured ? (
              <p className="mt-0.5 font-mono text-[11px] leading-4 tracking-[0.16em] text-accent uppercase">
                Primary focus
              </p>
            ) : null}
          </div>
        </div>
        {/* The list below already announces its length, so the count is visual only. On the featured card it aligns
            with the title line rather than the title-and-label block. */}
        <span
          aria-hidden="true"
          className={cn('shrink-0 font-mono text-xs text-fg-subtle tabular-nums', featured && 'self-start leading-6')}
        >
          {count}
        </span>
      </div>

      {featured && group.description ? (
        <p className="mt-4 max-w-md text-sm leading-relaxed text-pretty text-fg-muted">{group.description}</p>
      ) : null}

      <ul
        role="list"
        aria-labelledby={headingId}
        className={cn('flex flex-wrap gap-2', featured ? 'mt-6 lg:mt-auto lg:pt-10' : 'mt-5')}
      >
        {group.skills.map((skill) => (
          <li
            key={skill}
            className={cn(
              'rounded-lg border border-line bg-surface-2 text-sm',
              featured ? 'flex items-center gap-2 px-2.5 py-1 text-fg sm:px-3 sm:py-1.5' : 'px-2.5 py-1 text-fg-muted',
            )}
          >
            {featured ? <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-accent" /> : null}
            {skill}
          </li>
        ))}
      </ul>
    </div>
  )
}
