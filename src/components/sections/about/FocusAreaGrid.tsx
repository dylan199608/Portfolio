import { Layers, ListChecks, ScanSearch, ShieldCheck, type LucideIcon } from 'lucide-react'
import type { FocusArea } from '../../../data/resume'
import { staggerDelay } from '../../../lib/motion'
import { Reveal } from '../../ui/Reveal'

interface FocusAreaGridProps {
  areas: FocusArea[]
  className?: string
}

/** Maps the icon name stored in resume.ts to its lucide component. */
const FOCUS_ICONS: Record<FocusArea['icon'], LucideIcon> = {
  ListChecks,
  ScanSearch,
  ShieldCheck,
  Layers,
}

const LABEL_ID = 'about-focus-label'

export function FocusAreaGrid({ areas, className }: FocusAreaGridProps) {
  return (
    <div className={className}>
      <Reveal className="flex items-center gap-4">
        <p id={LABEL_ID} className="shrink-0 font-mono text-xs tracking-[0.16em] text-fg-subtle uppercase">
          What I focus on
        </p>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </Reveal>

      <ul role="list" aria-labelledby={LABEL_ID} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {areas.map((area, i) => {
          const Icon = FOCUS_ICONS[area.icon]
          return (
            <li key={area.title} className="min-w-0">
              <Reveal
                delay={staggerDelay(i)}
                className="h-full rounded-2xl border border-line bg-surface p-6 transition-colors duration-200 hover:border-line-strong"
              >
                <span
                  aria-hidden="true"
                  className="grid size-10 place-items-center rounded-lg border border-accent-line bg-accent-soft text-accent"
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-fg">{area.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-fg-muted">{area.description}</p>
              </Reveal>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
