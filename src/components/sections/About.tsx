import { focusAreas, profile, stats } from '../../data/resume'
import { cn } from '../../lib/cn'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { AboutStats } from './about/AboutStats'
import { FocusAreaGrid } from './about/FocusAreaGrid'

export function About() {
  return (
    <Section id="about" eyebrow="About" title="Engineering LLM systems where correctness matters.">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="max-w-2xl space-y-5 lg:col-span-7">
          {profile.summary.map((paragraph, i) => (
            <p
              key={paragraph}
              className={cn(
                'leading-relaxed text-pretty',
                i === 0 ? 'text-lg text-fg sm:text-xl' : 'text-base text-fg-muted sm:text-lg',
              )}
            >
              {paragraph}
            </p>
          ))}
        </Reveal>

        <AboutStats stats={stats} className="lg:col-span-5" />
      </div>

      <FocusAreaGrid areas={focusAreas} className="mt-16 sm:mt-20" />
    </Section>
  )
}
