import { Check } from 'lucide-react'
import type { Project } from '../../../data/resume'
import { Tag } from '../../ui/Tag'
import { ProjectFlow } from './ProjectFlow'

interface ProjectCardProps {
  project: Project
  /** Zero-based position in the list, shown as "01", "02", ... */
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const titleId = `project-${project.slug}-title`
  const stackId = `project-${project.slug}-stack`

  return (
    <article
      aria-labelledby={titleId}
      className="overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-300 hover:border-line-strong"
    >
      <div className="grid lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col p-6 sm:p-8 lg:p-10">
          {/* The heading comes first in the DOM so it leads for screen readers; the meta row is shown above it. */}
          <h3 id={titleId} className="mt-4 text-xl font-semibold tracking-tight text-balance text-fg sm:text-2xl">
            {project.title}
          </h3>
          <p className="order-first flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-fg-subtle">
            <span aria-hidden="true" className="text-accent tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span aria-hidden="true" className="h-px w-5 bg-line-strong" />
            <span>{project.org}</span>
            <span aria-hidden="true">·</span>
            <span>{project.period}</span>
          </p>

          <p className="mt-3 text-base leading-relaxed text-pretty text-fg-muted">{project.summary}</p>

          <ul className="mt-6 space-y-3">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-fg-muted">
                <Check aria-hidden="true" className="mt-[3px] size-4 shrink-0 text-accent" strokeWidth={2} />
                <span className="text-pretty">{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-8">
            <p id={stackId} className="font-mono text-xs tracking-[0.16em] text-fg-subtle uppercase">
              Built with
            </p>
            <ul aria-labelledby={stackId} className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li key={item}>
                  <Tag>{item}</Tag>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative flex items-center justify-center border-t border-line bg-surface-2/50 p-6 sm:p-8 lg:border-t-0 lg:border-l lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-grid bg-center mask-radial-from-25% mask-radial-to-75% opacity-80"
          />
          <ProjectFlow title={project.title} steps={project.flow} />
        </div>
      </div>
    </article>
  )
}
