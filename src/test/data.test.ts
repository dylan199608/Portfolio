import { describe, expect, it } from 'vitest'
import { toDateTime } from '../components/sections/experience/dates'
import { experience, headlineStats, navLinks, profile, projects, skills } from '../data/resume'

/** Files shipped from public/, keyed by their site path (e.g. "/Dylan-Allen-Resume.pdf"). Lazy: nothing is loaded. */
const publicFiles = new Set(
  Object.keys(import.meta.glob('../../public/**/*', { query: '?url', import: 'default' })).map((path) =>
    path.replace('../../public', ''),
  ),
)

/** "Jun 2024" → "2024-06"; fails the test for a label that is not a month and year. */
function monthOf(label: string): string {
  const month = toDateTime(label)
  expect(month, `"${label}" is not a "Mon YYYY" date`).toBeDefined()
  return month ?? ''
}

function duplicates(values: readonly string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) !== index)
}

describe('profile', () => {
  it('has a valid email address', () => {
    expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i)
  })

  it('links to a LinkedIn profile that matches the displayed handle', () => {
    const url = new URL(profile.linkedin)
    expect(url.protocol).toBe('https:')
    expect(url.hostname).toMatch(/(^|\.)linkedin\.com$/)
    expect(profile.linkedin.endsWith(profile.linkedinHandle)).toBe(true)
  })

  it('points the resume link at a PDF that ships in public/', () => {
    expect(profile.resumeUrl).toMatch(/^\/.+\.pdf$/)
    expect(publicFiles.has(profile.resumeUrl), `public${profile.resumeUrl} is missing`).toBe(true)
  })

  it('derives the initials from the name', () => {
    const initials = profile.name
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
    expect(profile.initials).toBe(initials)
  })

  it('restates the years of experience consistently', () => {
    const [years] = headlineStats
    expect(years).toBeDefined()
    expect(profile.intro).toContain(`${years?.value} years`)
  })
})

describe('navLinks', () => {
  it('has unique ids and non-empty labels', () => {
    expect(duplicates(navLinks.map((link) => link.id))).toEqual([])
    for (const link of navLinks) expect(link.label.trim()).not.toBe('')
  })
})

describe('experience', () => {
  it('lists three roles', () => {
    expect(experience).toHaveLength(3)
  })

  it('is in reverse-chronological order without overlapping roles', () => {
    for (let i = 1; i < experience.length; i++) {
      const newer = experience[i - 1]
      const older = experience[i]
      if (!newer || !older) throw new Error('missing role')

      expect(monthOf(newer.start) > monthOf(older.start), `${newer.company} starts after ${older.company}`).toBe(true)
      // A role may end in the month the next one starts, but not after it.
      expect(monthOf(older.end) <= monthOf(newer.start), `${older.company} ends before ${newer.company}`).toBe(true)
    }
  })

  it('ends every role after it starts', () => {
    for (const role of experience) {
      if (role.current) continue
      expect(monthOf(role.end) >= monthOf(role.start), `${role.company} dates`).toBe(true)
    }
  })

  it('marks only the latest role as current, ending "Present"', () => {
    expect(experience.map((role) => role.current)).toEqual([true, false, false])
    for (const role of experience) {
      expect(role.end === 'Present').toBe(role.current)
    }
  })

  it('gives every role a summary, highlights, and tags without duplicates', () => {
    for (const role of experience) {
      expect(role.summary.trim(), role.company).not.toBe('')
      expect(role.highlights.length, role.company).toBeGreaterThan(0)
      expect(role.tags.length, role.company).toBeGreaterThan(0)
      expect(duplicates(role.highlights), role.company).toEqual([])
      expect(duplicates(role.tags), role.company).toEqual([])
    }
  })
})

describe('projects', () => {
  it('have unique, id-safe slugs', () => {
    const slugs = projects.map((project) => project.slug)
    expect(duplicates(slugs)).toEqual([])
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  })

  it('have a non-empty flow and stack', () => {
    for (const project of projects) {
      expect(project.flow.length, project.slug).toBeGreaterThan(1)
      expect(project.stack.length, project.slug).toBeGreaterThan(0)
      for (const step of project.flow) expect(step.label.trim(), project.slug).not.toBe('')
      for (const item of project.stack) expect(item.trim(), project.slug).not.toBe('')
    }
  })

  it('each include at least one check step in the flow', () => {
    for (const project of projects) {
      expect(
        project.flow.some((step) => step.check === true),
        `${project.slug} has no check step`,
      ).toBe(true)
    }
  })

  it('come from roles listed under experience', () => {
    const companies = experience.map((role) => role.company)
    for (const project of projects) expect(companies, project.slug).toContain(project.org)
  })

  it('use an en dash for date ranges', () => {
    const range = /^(?:[A-Z][a-z]{2} )?\d{4} – (?:(?:[A-Z][a-z]{2} )?\d{4}|Present)$/
    for (const project of projects) expect(project.period, project.slug).toMatch(range)
  })
})

describe('skills', () => {
  it('have unique group ids and no duplicate skills within a group', () => {
    expect(duplicates(skills.map((group) => group.id))).toEqual([])
    for (const group of skills) {
      expect(group.skills.length, group.id).toBeGreaterThan(0)
      expect(duplicates(group.skills), group.id).toEqual([])
    }
  })
})
