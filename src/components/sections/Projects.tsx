import { projects } from '../../data/resume'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { ProjectCard } from './projects/ProjectCard'

export function Projects() {
  return (
    <Section
      id="work"
      eyebrow="Selected work"
      title="Systems built to be measurable, grounded, and safe."
      description="Three systems from production work (evaluation, retrieval, and assistant workflows) and how each one keeps model output in check."
    >
      <div className="space-y-6 sm:space-y-8">
        {projects.map((project, i) => (
          <Reveal key={project.slug}>
            <ProjectCard project={project} index={i} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
