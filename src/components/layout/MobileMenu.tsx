import { FileText, Mail } from 'lucide-react'
import { m } from 'motion/react'
import { useEffect, useRef } from 'react'
import { navLinks, profile } from '../../data/resume'
import { cn } from '../../lib/cn'
import { EASE_OUT } from '../../lib/motion'
import { ButtonLink } from '../ui/ButtonLink'
import { Container } from '../ui/Container'

interface MobileMenuProps {
  /** DOM id referenced by the menu button's aria-controls. */
  id: string
  activeId: string | null
  /** Called when any link in the panel is followed, so the navbar can close the menu. */
  onNavigate: () => void
}

/** Drop-down panel for small screens. Mount it inside <AnimatePresence> so it can animate out. */
export function MobileMenu({ id, activeId, onNavigate }: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  // Move focus into the panel as soon as it opens.
  useEffect(() => {
    firstLinkRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <m.div
      id={id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
      className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-line bg-bg shadow-card md:hidden"
    >
      <Container className="pt-3 pb-6">
        <nav aria-label="Mobile">
          <ul className="-mx-3 flex flex-col">
            {navLinks.map((link, index) => {
              const isActive = link.id === activeId
              return (
                <li key={link.id}>
                  <a
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={`#${link.id}`}
                    onClick={onNavigate}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'flex min-h-12 items-center gap-4 rounded-lg px-3 text-base font-medium transition-colors duration-200 hover:bg-surface-2 focus-visible:-outline-offset-2',
                      isActive ? 'text-fg' : 'text-fg-muted hover:text-fg',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn('w-5 font-mono text-xs tabular-nums', isActive ? 'text-accent' : 'text-fg-subtle')}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                    {isActive ? <span aria-hidden="true" className="ml-auto size-1.5 rounded-full bg-accent" /> : null}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-5">
          <ButtonLink href={profile.resumeUrl} external variant="secondary" onClick={onNavigate}>
            <FileText aria-hidden="true" />
            Resume
          </ButtonLink>
          <ButtonLink href={`mailto:${profile.email}`} variant="primary" onClick={onNavigate}>
            <Mail aria-hidden="true" />
            Email
          </ButtonLink>
        </div>
      </Container>
    </m.div>
  )
}
