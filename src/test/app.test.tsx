import { screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { education, experience, headlineStats, navLinks, profile } from '../data/resume'
import { setIntersecting } from './browserMocks'
import { renderApp } from './render'

afterEach(() => {
  vi.restoreAllMocks()
})

function normalizedText(element: Element): string {
  return (element.textContent ?? '').replace(/\s+/g, ' ').trim()
}

function sectionById(id: string): HTMLElement {
  const section = document.getElementById(id)
  if (!section) throw new Error(`#${id} is not rendered`)
  return section
}

describe('page structure', () => {
  it('renders exactly one h1, with the profile headline', () => {
    renderApp()

    const [h1, ...others] = screen.getAllByRole('heading', { level: 1 })
    expect(others).toHaveLength(0)
    expect(normalizedText(h1 as HTMLElement)).toBe(profile.headline)
  })

  it('renders a labelled section with an h2 for every nav link, in nav order', () => {
    renderApp()

    for (const link of navLinks) {
      const section = sectionById(link.id)
      expect(section.tagName, `#${link.id}`).toBe('SECTION')

      const [h2, ...extra] = within(section).getAllByRole('heading', { level: 2 })
      expect(extra, `#${link.id} has one h2`).toHaveLength(0)
      expect(section).toHaveAccessibleName(normalizedText(h2 as HTMLElement))
    }

    const main = screen.getByRole('main')
    const navIds = new Set<string>(navLinks.map((link) => link.id))
    const renderedOrder = Array.from(main.querySelectorAll('section[id]'))
      .map((section) => section.id)
      .filter((id) => navIds.has(id))
    expect(renderedOrder).toEqual(navLinks.map((link) => link.id))
  })

  it('keeps the hand-written years in the Experience title in line with the resume stats', () => {
    renderApp()

    const [years] = headlineStats
    const title = within(sectionById('experience')).getByRole('heading', { level: 2 })
    expect(title).toHaveTextContent(`${years?.value} years`)
  })

  it('never skips a heading level', () => {
    const { container } = renderApp()

    const levels = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((h) => Number(h.tagName[1]))
    expect(levels[0]).toBe(1)
    levels.forEach((level, i) => {
      if (i > 0) expect(level, `heading ${i}`).toBeLessThanOrEqual((levels[i - 1] ?? 1) + 1)
    })
  })

  it('has banner, primary navigation, main, and contentinfo landmarks', () => {
    renderApp()

    // Browsers only map <header>/<footer> to banner/contentinfo outside sectioning content (HTML-AAM), but
    // testing-library maps every one, including each section's own <header>. Apply the scoping rule here.
    const scoped = (element: HTMLElement) => !element.parentElement?.closest('article, aside, main, nav, section')
    const banners = screen.getAllByRole('banner').filter(scoped)
    const footers = screen.getAllByRole('contentinfo').filter(scoped)

    expect(banners).toHaveLength(1)
    expect(within(banners[0] as HTMLElement).getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(footers).toHaveLength(1)
  })

  it('links every primary nav item to its section', () => {
    renderApp()

    const nav = screen.getByRole('navigation', { name: 'Primary' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual(navLinks.map((link) => `#${link.id}`))
    expect(links.map((link) => link.textContent)).toEqual(navLinks.map((link) => link.label))
  })

  it('offers a skip link as the first tab stop, targeting the focusable main landmark', async () => {
    const { user } = renderApp()

    const skip = screen.getByRole('link', { name: 'Skip to content' })
    expect(skip).toHaveAttribute('href', '#main')
    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('id', 'main')
    expect(main).toHaveAttribute('tabindex', '-1')

    await user.tab()
    expect(skip).toHaveFocus()
  })
})

describe('navigation behavior', () => {
  it('scrolls a deep-linked section into view on load', () => {
    window.history.replaceState(null, '', '/#contact')
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')

    renderApp()

    expect(scrollIntoView).toHaveBeenCalled()
    expect(scrollIntoView.mock.contexts[0]).toBe(sectionById('contact'))
  })

  // Regression: decodeURIComponent throws URIError for a malformed escape such as /#%E0%A4%A. Uncaught inside the
  // effect, it made React unmount the whole page. useHashScroll now ignores a fragment it cannot decode.
  it('still renders the page when the URL fragment is malformed', () => {
    window.history.replaceState(null, '', '/#%E0%A4%A')
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
    scrollIntoView.mockClear()

    renderApp()

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('marks the nav link for the section in view with aria-current', () => {
    renderApp()
    const nav = screen.getByRole('navigation', { name: 'Primary' })

    expect(within(nav).queryAllByRole('link', { current: true })).toHaveLength(0)

    setIntersecting(sectionById('experience'))
    expect(within(nav).getByRole('link', { current: true })).toHaveTextContent('Experience')

    setIntersecting(sectionById('skills'))
    expect(within(nav).getAllByRole('link', { current: true })).toHaveLength(1)
    expect(within(nav).getByRole('link', { current: true })).toHaveTextContent('Skills')
  })
})

describe('links', () => {
  it('opens every new-tab link with rel="noopener noreferrer" and says so to screen readers', () => {
    const { container } = renderApp()

    const newTabLinks = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]'))
    expect(newTabLinks.length).toBeGreaterThan(0)
    for (const link of newTabLinks) {
      expect(link, link.href).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link, link.href).toHaveAccessibleName(/\(opens in new tab\)/)
    }
  })

  it('opens every off-site link in a new tab', () => {
    const { container } = renderApp()

    const offSite = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href^="http"]'))
    expect(offSite.length).toBeGreaterThan(0)
    for (const link of offSite) expect(link, link.href).toHaveAttribute('target', '_blank')
  })

  it('points every LinkedIn link at the profile', () => {
    renderApp()

    const linkedIn = screen.getAllByRole('link', { name: /linkedin/i })
    expect(linkedIn.length).toBeGreaterThan(0)
    for (const link of linkedIn) expect(link).toHaveAttribute('href', profile.linkedin)
  })

  it('points every resume link at profile.resumeUrl', async () => {
    const { user } = renderApp()
    // The mobile menu has its own resume link; open it so that one is checked too.
    await user.click(screen.getByRole('button', { name: 'Open menu' }))

    const resumeLinks = screen.getAllByRole('link', { name: /resume/i })
    expect(resumeLinks.length).toBeGreaterThan(0)
    for (const link of resumeLinks) expect(link).toHaveAttribute('href', profile.resumeUrl)
    const mobileNavPanel = screen.getByRole('navigation', { name: 'Mobile' }).parentElement as HTMLElement
    expect(within(mobileNavPanel).getByRole('link', { name: /resume/i })).toHaveAttribute('href', profile.resumeUrl)
  })

  it('points every in-page link at an element that exists', async () => {
    const { user, container } = renderApp()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))

    const hashLinks = Array.from(container.querySelectorAll('a[href^="#"]'))
    expect(hashLinks.length).toBeGreaterThan(0)
    for (const link of hashLinks) {
      const id = link.getAttribute('href')?.slice(1) ?? ''
      expect(document.getElementById(id), `#${id}`).not.toBeNull()
    }
  })

  it('sends every mailto: link to the profile email', () => {
    const { container } = renderApp()

    const mailLinks = Array.from(container.querySelectorAll('a[href^="mailto:"]'))
    expect(mailLinks.length).toBeGreaterThan(0)
    for (const link of mailLinks) {
      const address = link.getAttribute('href')?.slice('mailto:'.length).split('?')[0]
      expect(address).toBe(profile.email)
    }
  })

  it('lists the phone number first in the contact channels, as a tel: link', () => {
    expect(profile.showPhone).toBe(true)
    const { container } = renderApp()

    const phone = screen.getByRole('link', { name: new RegExp(profile.phone.replace(/\+/g, '\\+')) })
    expect(phone).toHaveAttribute('href', `tel:${profile.phone.replace(/[^\d+]/g, '')}`)
    expect(phone).not.toHaveAttribute('target')
    expect(container.querySelectorAll('a[href^="tel:"]')).toHaveLength(1)

    const contact = container.querySelector('#contact')
    const firstChannel = contact?.querySelector('ul > li')
    expect(firstChannel).toContainElement(phone)
  })

  it('keeps the phone number off the page when profile.showPhone is false', () => {
    const original = profile.showPhone
    profile.showPhone = false
    try {
      const { container } = renderApp()
      expect(container.querySelector('a[href^="tel:"]')).toBeNull()
      expect(container).not.toHaveTextContent(profile.phone)
    } finally {
      profile.showPhone = original
    }
  })

  it('shows every degree in the Education section', () => {
    const { container } = renderApp()
    const section = container.querySelector('#education')
    expect(section).not.toBeNull()

    for (const entry of education) {
      expect(
        within(section as HTMLElement).getByRole('heading', { level: 3, name: `${entry.degreeName} in ${entry.field}` }),
      ).toBeInTheDocument()
      expect(section).toHaveTextContent(entry.school)
      expect(section).toHaveTextContent(entry.year)
    }
    // The career path lists every role after graduation.
    for (const role of experience) expect(section).toHaveTextContent(role.title)
  })
})
