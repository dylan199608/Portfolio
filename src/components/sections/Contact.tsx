import { ArrowUpRight, Mail } from 'lucide-react'
import { profile } from '../../data/resume'
import { ButtonLink } from '../ui/ButtonLink'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { ContactChannels } from './contact/ContactChannels'
import { CopyEmailButton } from './contact/CopyEmailButton'

const firstName = profile.name.split(' ')[0]
const mailtoHref = `mailto:${profile.email}`
const composeHref = `${mailtoHref}?subject=${encodeURIComponent(`Hello ${firstName}`)}`

// Split at "@" so a narrow screen breaks the address there instead of mid-word.
const atIndex = profile.email.lastIndexOf('@')
const emailUser = atIndex > 0 ? profile.email.slice(0, atIndex) : ''
const emailDomain = atIndex > 0 ? profile.email.slice(atIndex) : profile.email

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let’s build AI your users can rely on."
      description="Have a role, a project, or an LLM system that needs to get things right? Email is the fastest way to reach me."
    >
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-grid mask-radial-at-top-right mask-radial-from-10% mask-radial-to-75%"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-56 -right-48 size-[34rem] rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-accent-line to-transparent"
          />

          <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div className="min-w-0">
              <p className="font-mono text-xs tracking-[0.16em] text-fg-subtle uppercase">Email</p>
              {/* The ::after strip extends the hit area to 40px on phones without shifting the layout. */}
              <a
                href={mailtoHref}
                className="group relative mt-3 inline-block text-xl font-semibold tracking-tight text-fg transition-colors duration-200 [overflow-wrap:anywhere] after:absolute after:inset-x-0 after:-inset-y-1.5 hover:text-accent sm:text-3xl"
              >
                {emailUser}
                {emailUser ? <wbr /> : null}
                <span className={emailUser ? 'whitespace-nowrap' : undefined}>
                  {emailDomain}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="ml-1.5 inline-block size-5 align-[-0.15em] text-fg-subtle transition duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 group-hover:text-accent sm:ml-2 sm:size-7"
                  />
                </span>
              </a>

              <div className="mt-6 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap sm:mt-8">
                <ButtonLink href={composeHref} variant="primary" size="md">
                  <Mail aria-hidden="true" />
                  Send an email
                </ButtonLink>
                <CopyEmailButton email={profile.email} />
              </div>
            </div>

            <ContactChannels />
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
