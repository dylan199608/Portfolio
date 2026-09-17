import { experience } from '../../data/resume'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { RoleItem } from './experience/RoleItem'

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      // Restates the years from resume.ts (profile.intro, headlineStats); update it by hand if they change.
      // One block per sentence, so the break falls between the sentences rather than mid-phrase.
      title={
        <>
          <span className="block">8+ years in production.</span>{' '}
          <span className="block">The last four inside LLM systems.</span>
        </>
      }
    >
      <ol>
        {experience.map((role, index) => (
          <li key={`${role.company}-${role.start}`}>
            <Reveal>
              <RoleItem role={role} isFirst={index === 0} isLast={index === experience.length - 1} />
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
