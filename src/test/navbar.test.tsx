import { screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { navLinks } from '../data/resume'
import { setMediaFeature, setViewportWidth } from './browserMocks'
import { renderApp } from './render'

const PHONE_WIDTH = 375
const DESKTOP_WIDTH = 1280

afterEach(() => {
  vi.restoreAllMocks()
  document.head.querySelector('meta[name="theme-color"]')?.remove()
})

describe('theme toggle', () => {
  it('switches the theme, updates its label, and saves the choice', async () => {
    const { user } = renderApp()
    expect(document.documentElement.dataset.theme).toBeUndefined()

    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    const toggle = await screen.findByRole('button', { name: 'Switch to light theme' })

    await user.click(toggle)

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
    expect(await screen.findByRole('button', { name: 'Switch to dark theme' })).toBe(toggle)
  })

  it('starts from the theme resolved before paint', () => {
    document.documentElement.dataset.theme = 'dark'
    renderApp()
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
  })

  it('keeps the browser theme-color in step with the theme', async () => {
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = 'initial'
    document.head.append(meta)
    const { user } = renderApp()

    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    const dark = meta.content
    await user.click(await screen.findByRole('button', { name: 'Switch to light theme' }))
    const light = meta.content

    expect(dark).toMatch(/^#[0-9a-f]{6}$/i)
    expect(light).toMatch(/^#[0-9a-f]{6}$/i)
    expect(dark).not.toBe(light)
  })

  it('still toggles when storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('The quota has been exceeded.', 'QuotaExceededError')
    })
    const { user } = renderApp()

    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(await screen.findByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
  })

  it('follows the system color scheme until the visitor picks a theme', async () => {
    const { user } = renderApp()

    setMediaFeature('prefers-color-scheme', 'dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(await screen.findByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(document.documentElement.dataset.theme).toBe('light')

    // An explicit choice is saved, so later system changes no longer override it.
    setMediaFeature('prefers-color-scheme', 'light')
    setMediaFeature('prefers-color-scheme', 'dark')
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})

describe('mobile menu', () => {
  beforeEach(() => {
    setViewportWidth(PHONE_WIDTH)
  })

  function getMenuButton() {
    return screen.getByRole('button', { name: /^(open|close) menu$/i })
  }

  function queryMobileNav() {
    return screen.queryByRole('navigation', { name: 'Mobile' })
  }

  it('starts closed', () => {
    renderApp()

    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'false')
    expect(getMenuButton()).toHaveAccessibleName('Open menu')
    expect(queryMobileNav()).not.toBeInTheDocument()
  })

  it('opens a labelled panel, marks the button expanded, and moves focus into it', async () => {
    const { user } = renderApp()
    const button = getMenuButton()

    await user.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveAccessibleName('Close menu')

    const panelId = button.getAttribute('aria-controls')
    expect(panelId).toBeTruthy()
    const panel = document.getElementById(panelId ?? '')
    expect(panel).toBeInTheDocument()

    const nav = within(panel as HTMLElement).getByRole('navigation', { name: 'Mobile' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual(navLinks.map((link) => `#${link.id}`))
    expect(links[0]).toHaveFocus()
  })

  it('closes on Escape and returns focus to the menu button', async () => {
    const { user } = renderApp()
    const button = getMenuButton()
    await user.click(button)
    expect(queryMobileNav()).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAccessibleName('Open menu')
    expect(button).toHaveFocus()
    await waitFor(() => expect(queryMobileNav()).not.toBeInTheDocument())
  })

  it('closes when the button is pressed again', async () => {
    const { user } = renderApp()
    const button = getMenuButton()

    await user.click(button)
    await user.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(queryMobileNav()).not.toBeInTheDocument())
  })

  it('closes after following one of its links', async () => {
    const { user } = renderApp()
    await user.click(getMenuButton())

    const nav = queryMobileNav() as HTMLElement
    await user.click(within(nav).getByRole('link', { name: 'Contact' }))

    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(queryMobileNav()).not.toBeInTheDocument())
  })

  it('closes when focus tabs past its last item', async () => {
    const { user } = renderApp()
    await user.click(getMenuButton())

    const panel = document.getElementById(getMenuButton().getAttribute('aria-controls') ?? '') as HTMLElement
    const lastLink = within(panel).getAllByRole('link').at(-1) as HTMLElement
    lastLink.focus()
    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'true')

    await user.tab()

    expect(panel).not.toContainElement(document.activeElement as HTMLElement)
    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'false')
  })

  it('stays open while focus moves within the header', async () => {
    const { user } = renderApp()
    await user.click(getMenuButton())

    await user.tab()

    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes when the viewport widens to the desktop layout', async () => {
    const { user } = renderApp()
    await user.click(getMenuButton())
    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'true')

    setViewportWidth(DESKTOP_WIDTH)

    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(queryMobileNav()).not.toBeInTheDocument())
  })
})
