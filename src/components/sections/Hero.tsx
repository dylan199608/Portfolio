import { ArrowRight, Download, Mail } from 'lucide-react'
import { m, stagger, type Variants } from 'motion/react'
import { headlineStats, profile, skills, type Stat } from '../../data/resume'
import { cn } from '../../lib/cn'
import { EASE_OUT } from '../../lib/motion'
import { ButtonLink } from '../ui/ButtonLink'
import { Container } from '../ui/Container'
import { LinkedInIcon } from '../ui/icons'
import { GuardrailConsole } from './hero/GuardrailConsole'
import { splitHeadline } from './hero/headline'

const textGroup: Variants = {
  hidden: {},
  show: { transition: { delayChildren: stagger(0.07) } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}

/** The h1 is the LCP element: slide it without fading so it counts as painted on first render. */
const slideUp: Variants = {
  hidden: { y: 14 },
  show: { y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}

const [headlineLead, headlineTail] = splitHeadline(profile.headline)

/** Compact form for the status pill; screen readers still get the full location. */
const shortLocation = profile.location.replace(/,\s*United States$/, ', US')

/** A fact in the row under the intro; `wide` facts get a full row wherever the grid has two columns. */
interface HeroFact extends Stat {
  wide?: boolean
}

const coreLanguages = skills.find((group) => group.id === 'languages')?.skills.slice(0, 3) ?? []
const facts: HeroFact[] = [
  ...headlineStats,
  ...(coreLanguages.length > 0 ? [{ value: coreLanguages.join(' · '), label: 'Core languages', wide: true }] : []),
]

const iconLinkClass =
  'inline-flex size-12 items-center justify-center rounded-lg text-fg-muted transition-colors duration-200 hover:bg-surface-2 hover:text-fg'

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-fade-b" />
        <div className="absolute -top-56 -right-56 size-[26rem] rounded-full bg-(--glow) blur-3xl sm:-top-72 sm:-right-40 sm:size-[40rem]" />
      </div>

      <Container className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)] lg:items-center lg:gap-10 xl:grid-cols-[1.15fr_1fr] xl:gap-16">
        {/* Below lg the text and the console share one max width, so their right edges line up. */}
        <m.div className="max-w-2xl min-w-0 lg:max-w-none" variants={textGroup} initial="hidden" animate="show">
          <m.p
            variants={fadeUp}
            className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-line bg-surface/70 px-3 py-1 font-mono text-xs text-fg-muted"
          >
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent ring-4 ring-accent-soft" />
            <span>
              {profile.role}
              <span aria-hidden="true" className="px-1.5 text-fg-subtle">
                ·
              </span>
              <span className="sr-only">, </span>
              {shortLocation === profile.location ? (
                profile.location
              ) : (
                <>
                  <span aria-hidden="true">{shortLocation}</span>
                  <span className="sr-only">{profile.location}</span>
                </>
              )}
            </span>
          </m.p>

          <m.h1
            id="hero-title"
            variants={slideUp}
            className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:leading-[1.05] xl:text-[3.5rem]"
          >
            {headlineLead}
            {headlineTail ? (
              <>
                {/* Non-breaking space keeps the em dash from starting a line. */}
                &nbsp;—{' '}
                <span className="text-fg-muted">{headlineTail}</span>
              </>
            ) : null}
          </m.h1>

          <m.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-fg-muted">
            {profile.intro}
          </m.p>

          <m.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="#work" size="lg" className="group w-full sm:w-auto">
              View selected work
              <ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href={profile.resumeUrl} download variant="secondary" size="lg" className="flex-1 sm:flex-none">
              <Download aria-hidden="true" />
              Download resume
            </ButtonLink>
            <span className="flex items-center gap-0.5">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile (opens in new tab)"
                className={iconLinkClass}
              >
                <LinkedInIcon className="size-[18px]" />
              </a>
              <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.name}`} className={iconLinkClass}>
                <Mail aria-hidden="true" className="size-5" />
              </a>
            </span>
          </m.div>

          <m.dl
            variants={fadeUp}
            className="mt-10 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-line pt-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
          >
            {facts.map((fact) => (
              <div
                key={fact.label}
                className={cn(
                  'flex min-w-0 flex-col',
                  fact.wide && 'col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-1',
                )}
              >
                <dt className="order-1 mt-1 text-xs leading-snug text-pretty text-fg-subtle">{fact.label}</dt>
                <dd className="font-mono text-sm font-medium text-fg">{fact.value}</dd>
              </div>
            ))}
          </m.dl>
        </m.div>

        <m.div
          className="w-full max-w-2xl min-w-0 lg:max-w-none"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.25 }}
        >
          <GuardrailConsole />
        </m.div>
      </Container>
    </section>
  )
}
