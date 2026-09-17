import { FileText, Menu, X } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type FocusEvent } from 'react'
import { navLinks, profile } from '../../data/resume'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useScrolled } from '../../hooks/useScrolled'
import { cn } from '../../lib/cn'
import { EASE_OUT } from '../../lib/motion'
import { ButtonLink } from '../ui/ButtonLink'
import { Container } from '../ui/Container'
import { MobileMenu } from './MobileMenu'
import { ThemeToggle } from './ThemeToggle'

const SECTION_IDS = navLinks.map((link) => link.id)
const MENU_ID = 'mobile-menu'
/** Tailwind's `md` breakpoint, where the inline nav replaces the menu. */
const DESKTOP_QUERY = '(min-width: 48rem)'

export function Navbar() {
  const scrolled = useScrolled()
  const activeId = useActiveSection(SECTION_IDS)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  // While the menu is open, close it on Escape or when the viewport reaches md. Taps outside it land on the scrim.
  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
    const desktop = window.matchMedia(DESKTOP_QUERY)
    const onBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onBreakpointChange)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onBreakpointChange)
    }
  }, [menuOpen])

  // Tabbing out of the open menu (past its last link) closes it, so it never covers the focused content.
  const onHeaderBlur = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget
    if (menuOpen && next instanceof Node && !event.currentTarget.contains(next)) setMenuOpen(false)
  }

  const solid = scrolled || menuOpen

  return (
    <header onBlur={onHeaderBlur} className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'h-16 border-b transition duration-300 ease-out',
          solid ? 'border-line bg-bg/80 backdrop-blur-md' : 'border-transparent bg-transparent',
        )}
      >
        <Container className="flex h-full items-center justify-between gap-4">
          <a href="#top" onClick={closeMenu} className="group flex shrink-0 items-center gap-2.5 rounded-lg">
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-lg border border-accent-line bg-accent-soft font-mono text-xs font-semibold tracking-tight text-accent transition-colors duration-200 group-hover:border-accent"
            >
              {profile.initials}
            </span>
            <span className="text-sm font-semibold tracking-tight text-fg">{profile.name}</span>
            <span className="sr-only">, back to top</span>
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = link.id === activeId
                return (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'relative block rounded-md px-2.5 py-2 text-sm transition-colors duration-200 lg:px-3',
                        isActive ? 'text-fg' : 'text-fg-muted hover:text-fg',
                      )}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute bottom-0.5 left-1/2 -ml-0.5 size-1 rounded-full bg-accent transition-[opacity,scale] duration-300 ease-out motion-reduce:transition-none',
                          isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                        )}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            {/* Hidden from md to lg, where the six inline links need the room; the hero and Contact also link the resume. */}
            <div className="hidden sm:block md:hidden lg:block">
              <ButtonLink href={profile.resumeUrl} external variant="secondary" size="sm">
                <FileText aria-hidden="true" />
                Resume
              </ButtonLink>
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? MENU_ID : undefined}
              className={cn(
                '-mr-2 inline-grid size-10 cursor-pointer place-items-center rounded-lg transition-colors duration-200 hover:bg-surface-2 hover:text-fg md:hidden',
                menuOpen ? 'text-fg' : 'text-fg-muted',
              )}
            >
              {menuOpen ? (
                <X aria-hidden="true" className="size-5" />
              ) : (
                <Menu aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>
        </Container>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          // Dims the page under the panel; a tap on it only dismisses the menu instead of activating what is beneath.
          <m.div
            key="mobile-menu-scrim"
            aria-hidden="true"
            onClick={closeMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="fixed inset-x-0 top-16 bottom-0 bg-bg/70 md:hidden"
          />
        ) : null}
        {menuOpen ? <MobileMenu key="mobile-menu" id={MENU_ID} activeId={activeId} onNavigate={closeMenu} /> : null}
      </AnimatePresence>
    </header>
  )
}
