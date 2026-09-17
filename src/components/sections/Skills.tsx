import { skills } from '../../data/resume'
import { cn } from '../../lib/cn'
import { staggerDelay } from '../../lib/motion'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { placement } from './skills/placement'
import { SkillCard } from './skills/SkillCard'

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      // One block per clause, so the break falls after the comma rather than mid-phrase.
      title={
        <>
          <span className="block">A full-stack toolkit,</span>{' '}
          <span className="block">with depth in AI systems.</span>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => (
          <Reveal key={group.id} delay={staggerDelay(i)} className={cn('min-w-0', placement(i, skills.length))}>
            <SkillCard group={group} featured={i === 0} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
