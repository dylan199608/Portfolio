import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useTheme } from './useTheme'

function ThemeProbe({ name }: { name: string }) {
  const { theme, toggleTheme } = useTheme()
  return (
    <button type="button" aria-label={name} onClick={toggleTheme}>
      {theme}
    </button>
  )
}

afterEach(() => {
  delete document.documentElement.dataset.theme
  localStorage.clear()
})

describe('useTheme', () => {
  it('reads the theme set before paint', () => {
    document.documentElement.dataset.theme = 'dark'
    render(<ThemeProbe name="toggle" />)
    expect(screen.getByRole('button', { name: 'toggle' })).toHaveTextContent('dark')
  })

  it('keeps every consumer in sync and saves the choice', async () => {
    document.documentElement.dataset.theme = 'dark'
    render(
      <>
        <ThemeProbe name="first" />
        <ThemeProbe name="second" />
      </>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'first' }))

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'first' })).toHaveTextContent('light')
      expect(screen.getByRole('button', { name: 'second' })).toHaveTextContent('light')
    })
  })
})
