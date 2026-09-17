import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { experience, profile } from '../data/resume'
import { renderApp } from './render'

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  Reflect.deleteProperty(window.navigator, 'clipboard')
  Reflect.deleteProperty(window, 'isSecureContext')
  Reflect.deleteProperty(document, 'execCommand')
})

describe('experience highlights disclosure', () => {
  const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  /**
   * The exact label, visible text plus the screen-reader suffix. It is checked through text content because jsdom
   * reports spans as non-inline, so accessible-name computation inserts a space before the suffix span.
   */
  const exactLabel = (text: string) => new RegExp(`^${escapeRegExp(text)}$`)

  function getExperienceSection() {
    return screen.getByRole('region', { name: /years in production/i })
  }

  function getDisclosure(roleLabel: string) {
    return within(getExperienceSection()).getByRole('button', {
      name: new RegExp(`^Show (\\d+ more highlights|less) ?, ${escapeRegExp(roleLabel)}$`),
    })
  }

  function getControlledList(button: HTMLElement) {
    const id = button.getAttribute('aria-controls')
    const list = id ? document.getElementById(id) : null
    if (!list) throw new Error('the disclosure does not control a rendered list')
    return list
  }

  it.each(experience.map((role) => [`${role.title} at ${role.company}`, role] as const))(
    'reveals and hides the remaining highlights for %s',
    async (roleLabel, role) => {
      const { user } = renderApp()
      const button = getDisclosure(roleLabel)
      const list = getControlledList(button)

      expect(button).toHaveAttribute('aria-expanded', 'false')
      const shown = within(list).getAllByRole('listitem').length
      const hidden = role.highlights.slice(shown)
      expect(shown).toBeGreaterThan(0)
      expect(hidden.length).toBeGreaterThan(0)
      expect(button).toHaveTextContent(exactLabel(`Show ${hidden.length} more highlights, ${roleLabel}`))
      for (const highlight of hidden) expect(within(list).queryByText(highlight)).not.toBeInTheDocument()

      await user.click(button)

      expect(button).toHaveAttribute('aria-expanded', 'true')
      expect(button).toHaveTextContent(exactLabel(`Show less, ${roleLabel}`))
      expect(within(list).getAllByRole('listitem')).toHaveLength(role.highlights.length)
      for (const highlight of role.highlights) expect(within(list).getByText(highlight)).toBeInTheDocument()

      await user.click(button)

      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button).toHaveTextContent(exactLabel(`Show ${hidden.length} more highlights, ${roleLabel}`))
      await waitFor(() => expect(within(list).getAllByRole('listitem')).toHaveLength(shown))
      for (const highlight of hidden) expect(within(list).queryByText(highlight)).not.toBeInTheDocument()
      expect(button).toHaveFocus()
    },
  )

  it('expands one role without affecting the others', async () => {
    const { user } = renderApp()
    const [first, second] = experience.map((role) => getDisclosure(`${role.title} at ${role.company}`))

    await user.click(first as HTMLElement)

    expect(first).toHaveAttribute('aria-expanded', 'true')
    expect(second).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('copy email button', () => {
  /** Installs a Clipboard API stand-in. Call after renderApp(): user-event attaches its own clipboard in setup(). */
  function mockClipboard(writeText: (text: string) => Promise<void>) {
    const spy = vi.fn(writeText)
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText: spy } })
    Object.defineProperty(window, 'isSecureContext', { configurable: true, value: true })
    return spy
  }

  /** Stubs the legacy execCommand('copy') fallback, which jsdom does not implement. */
  function mockExecCommand(result: boolean) {
    const spy = vi.fn((command: string) => command === 'copy' && result)
    Object.defineProperty(document, 'execCommand', { configurable: true, value: spy })
    return spy
  }

  const copyButton = () => screen.getByRole('button', { name: /^(copy email|copied|copy failed)$/i })

  it('copies the email, confirms it, and announces it politely', async () => {
    const { user } = renderApp()
    const writeText = mockClipboard(() => Promise.resolve())
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveTextContent('')

    await user.click(screen.getByRole('button', { name: 'Copy email' }))

    expect(writeText).toHaveBeenCalledTimes(1)
    expect(writeText).toHaveBeenCalledWith(profile.email)
    expect(await screen.findByRole('button', { name: 'Copied' })).toBe(copyButton())
    expect(status).toHaveTextContent('Email address copied to clipboard.')
  })

  it('resets the label two seconds after copying', async () => {
    // Only the reset timer is faked. The click goes through act() rather than user-event or findBy*, whose
    // internal setTimeout(0) would never fire under fake timers.
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    renderApp()
    mockClipboard(() => Promise.resolve())
    const button = screen.getByRole('button', { name: 'Copy email' })

    await act(async () => {
      fireEvent.click(button)
    })
    expect(button).toHaveAccessibleName('Copied')

    act(() => {
      vi.advanceTimersByTime(1999)
    })
    expect(button).toHaveAccessibleName('Copied')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(button).toHaveAccessibleName('Copy email')
    expect(screen.getByRole('status').textContent).toBe('')
  })

  it('restarts the reset timer when copying again', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    renderApp()
    mockClipboard(() => Promise.resolve())
    const button = screen.getByRole('button', { name: 'Copy email' })

    await act(async () => {
      fireEvent.click(button)
    })
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    await act(async () => {
      fireEvent.click(button)
    })
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(button).toHaveAccessibleName('Copied')

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(button).toHaveAccessibleName('Copy email')
  })

  it('falls back to execCommand when the Clipboard API rejects', async () => {
    const { user } = renderApp()
    mockClipboard(() => Promise.reject(new DOMException('Document is not focused.', 'NotAllowedError')))
    const execCommand = mockExecCommand(true)

    await user.click(screen.getByRole('button', { name: 'Copy email' }))

    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument()
    expect(execCommand).toHaveBeenCalledWith('copy')
    // The temporary textarea is removed and focus goes back to the button.
    expect(document.querySelector('textarea')).toBeNull()
    expect(copyButton()).toHaveFocus()
  })

  it('shows a failure label and announces the address when copying is impossible', async () => {
    const { user } = renderApp()
    const writeText = mockClipboard(() => Promise.reject(new DOMException('Denied.', 'NotAllowedError')))
    mockExecCommand(false)

    await user.click(screen.getByRole('button', { name: 'Copy email' }))

    expect(writeText).toHaveBeenCalledWith(profile.email)
    expect(await screen.findByRole('button', { name: 'Copy failed' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      `Could not copy automatically. The email address is ${profile.email}.`,
    )
  })

  it('re-announces a repeated copy', async () => {
    const { user } = renderApp()
    mockClipboard(() => Promise.resolve())
    const status = screen.getByRole('status')

    await user.click(screen.getByRole('button', { name: 'Copy email' }))
    await screen.findByRole('button', { name: 'Copied' })
    const firstAnnouncement = status.firstElementChild

    await user.click(copyButton())

    // A fresh node makes screen readers speak the unchanged message again.
    await waitFor(() => expect(status.firstElementChild).not.toBe(firstAnnouncement))
    expect(status).toHaveTextContent('Email address copied to clipboard.')
  })
})
