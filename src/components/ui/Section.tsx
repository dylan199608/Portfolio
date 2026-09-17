import type { ReactNode } from 'react'
import { navLinks, type SectionId } from '../../data/resume'
import { cn } from '../../lib/cn'
import { Container } from './Container'
import { Reveal } from './Reveal'

interface SectionProps {
  /** Also sets the two-digit index in the eyebrow ("01"), from this section's position in `navLinks`. */
  id: SectionId
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  className?: string
}

export function Section({ id, eyebrow, title, description, children, className }: SectionProps) {
  const titleId = `${id}-title`
  const position = navLinks.findIndex((link) => link.id === id)
  const index = position === -1 ? null : String(position + 1).padStart(2, '0')

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn('relative border-t border-line py-24 sm:py-32', className)}
    >
      <Container>
        <Reveal>
          <header className="mb-12 max-w-2xl sm:mb-16">
            <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
              {index ? (
                <>
                  <span className="text-fg-subtle">{index}</span>
                  <span aria-hidden="true" className="mx-2 text-fg-subtle">
                    /
                  </span>
                </>
              ) : null}
              {eyebrow}
            </p>
            <h2 id={titleId} className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-4 text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">{description}</p>
            ) : null}
          </header>
        </Reveal>
        {children}
      </Container>
    </section>
  )
}
