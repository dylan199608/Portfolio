import { describe, expect, it } from 'vitest'
import indexHtml from '../../index.html?raw'
import manifestRaw from '../../public/site.webmanifest?raw'
import { education, headlineStats, profile, skills } from '../data/resume'

/**
 * Search engines and link previews read index.html and the manifest before any JavaScript runs, so a few resume
 * facts are copied there by hand. These tests fail when those copies drift from resume.ts.
 */

interface PersonJsonLd {
  name: string
  jobTitle: string
  description: string
  email: string
  sameAs: string[]
  alumniOf: { name: string }
  knowsAbout: string[]
}

const doc = new DOMParser().parseFromString(indexHtml, 'text/html')
const metaContent = (attribute: string) => doc.querySelector(`meta[${attribute}]`)?.getAttribute('content')
const pageTitle = `${profile.name} — ${profile.role}`

describe('index.html head metadata', () => {
  it('uses the name and role for titles', () => {
    expect(doc.title).toBe(pageTitle)
    expect(metaContent('property="og:title"')).toBe(pageTitle)
    expect(metaContent('name="twitter:title"')).toBe(pageTitle)
    expect(metaContent('name="author"')).toBe(profile.name)
    expect(metaContent('property="og:site_name"')).toBe(profile.name)
  })

  it('keeps the search and social descriptions identical and in line with the resume', () => {
    const description = metaContent('name="description"')
    const [years] = headlineStats
    expect(years).toBeDefined()
    expect(description).toContain(profile.role)
    // "8+ years building production web applications"
    expect(description).toContain(`${years?.value} ${years?.label.toLowerCase()}`)
    expect(metaContent('property="og:description"')).toBe(description)
    expect(metaContent('name="twitter:description"')).toBe(description)
  })

  it('mirrors the profile in the JSON-LD Person record', () => {
    const script = doc.querySelector('script[type="application/ld+json"]')
    const person = JSON.parse(script?.textContent ?? '{}') as PersonJsonLd

    expect(person.name).toBe(profile.name)
    expect(person.jobTitle).toBe(profile.role)
    expect(person.description).toBe(profile.intro)
    expect(person.email).toBe(`mailto:${profile.email}`)
    expect(person.sameAs).toContain(profile.linkedin)
    expect(person.alumniOf.name).toBe(education[0]?.school)

    const allSkills = skills.flatMap((group) => group.skills).map((skill) => skill.toLowerCase())
    for (const topic of person.knowsAbout) {
      expect(
        allSkills.some((skill) => skill.includes(topic.toLowerCase())),
        `knowsAbout "${topic}" is not in skills`,
      ).toBe(true)
    }
  })

  it('links the email in the noscript fallback', () => {
    expect(indexHtml).toContain(`mailto:${profile.email}`)
    expect(doc.querySelector('noscript')?.textContent).toContain(profile.email)
  })
})

describe('site.webmanifest', () => {
  it('mirrors the name, role, and intro', () => {
    const manifest = JSON.parse(manifestRaw) as { name: string; short_name: string; description: string }
    expect(manifest.name).toBe(pageTitle)
    expect(manifest.short_name).toBe(profile.name)
    expect(manifest.description).toContain(profile.intro)
  })
})
