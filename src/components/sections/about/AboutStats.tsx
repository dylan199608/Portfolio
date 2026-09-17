import type { Stat } from '../../../data/resume'
import { cn } from '../../../lib/cn'
import { staggerDelay } from '../../../lib/motion'
import { Reveal } from '../../ui/Reveal'

interface AboutStatsProps {
  stats: Stat[]
  className?: string
}

/**
 * Headline numbers as one description list.
 * Each stat is a dt/dd pair: the value is the term (dt) and its label the description (dd), so both the visual and
 * the reading order are value first. Tiles sit side by side on smaller screens and stack beside the summary at lg.
 */
export function AboutStats({ stats, className }: AboutStatsProps) {
  return (
    <dl className={cn('grid grid-cols-2 content-start gap-3 sm:gap-4 lg:grid-cols-1', className)}>
      {stats.map((stat, i) => (
        <Reveal
          key={stat.label}
          delay={staggerDelay(i)}
          className="flex min-w-0 flex-col rounded-2xl border border-line bg-surface p-5 sm:p-6"
        >
          <dt className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{stat.value}</dt>
          <dd className="mt-2 text-sm leading-snug text-pretty text-fg-muted">{stat.label}</dd>
        </Reveal>
      ))}
    </dl>
  )
}
