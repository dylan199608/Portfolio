import { ArrowUp, Mail } from 'lucide-react'
import { profile } from '../../data/resume'
import { Container } from '../ui/Container'
import { LinkedInIcon } from '../ui/icons'

const linkClasses =
  'inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-lg text-fg-muted transition-colors duration-200 hover:bg-surface-2 hover:text-fg'

export function Footer() {
  const year = new Date().getFullYear()
  const firstName = profile.name.split(' ')[0]

  return (
    <footer className="border-t border-line py-10">
      <Container className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between sm:gap-4">
        <div className="flex flex-col items-center gap-1.5 text-center sm:items-start sm:text-left">
          <p className="text-sm text-fg-subtle">
            © {year} {profile.name}
          </p>
          <p className="text-xs text-fg-subtle">
            {profile.role}
            <span aria-hidden="true" className="mx-1.5">
              ·
            </span>
            {profile.location}
          </p>
        </div>

        <div className="flex items-center">
          <ul className="flex items-center gap-1">
            <li>
              <a href={`mailto:${profile.email}`} aria-label={`Email ${firstName}`} className={linkClasses}>
                <Mail aria-hidden="true" className="size-[18px]" />
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                <LinkedInIcon className="size-[15px]" />
                <span className="sr-only">{firstName} on LinkedIn (opens in new tab)</span>
              </a>
            </li>
          </ul>
          <span aria-hidden="true" className="mx-2 h-5 w-px bg-line" />
          <a href="#top" className={`${linkClasses} px-2.5 text-sm sm:-mr-3 sm:px-3`}>
            <ArrowUp aria-hidden="true" className="size-4" />
            <span className="sr-only sm:not-sr-only">Back to top</span>
          </a>
        </div>
      </Container>
    </footer>
  )
}
