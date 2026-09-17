import { useCallback, useEffect, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const THEME_COLORS: Record<Theme, string> = { light: '#fbfbfa', dark: '#09090b' }

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
}

function savedTheme(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

/** The <html data-theme> attribute is the store: every consumer re-renders when it changes, from any source. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  // Follow a choice made in another tab.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && (event.newValue === 'light' || event.newValue === 'dark')) {
      applyTheme(event.newValue)
    }
  }
  window.addEventListener('storage', onStorage)

  return () => {
    observer.disconnect()
    window.removeEventListener('storage', onStorage)
  }
}

/**
 * The initial theme is resolved before first paint by the inline script in index.html
 * (saved choice, then system preference). This hook keeps React in sync with it.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme)

  // Follow the OS setting until the visitor makes an explicit choice.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => {
      if (!savedTheme()) applyTheme(event.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = useCallback(() => {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable (private mode): the choice just won't persist */
    }
  }, [])

  return { theme, toggleTheme }
}
