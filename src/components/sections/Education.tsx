import { education } from '../../data/resume'
import { staggerDelay } from '../../lib/motion'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { EducationCard } from './education/EducationCard'

export function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Grounded in computer science.">
      <ol className="space-y-6 sm:space-y-8">
        {education.map((entry, i) => (
          <li key={`${entry.school}-${entry.year}`}>
            <Reveal delay={staggerDelay(i)}>
              <EducationCard entry={entry} showCareerPath={i === 0} />
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
