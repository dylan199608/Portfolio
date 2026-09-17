import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import { matchMediaMock, MockIntersectionObserver, resetMediaMocks } from './browserMocks'

afterEach(() => {
  cleanup()

  // Reset page-level state that would otherwise leak into the next test in the same file.
  resetMediaMocks()
  window.history.replaceState(null, '', '/')
  delete document.documentElement.dataset.theme
  localStorage.clear()
})

// jsdom lacks the browser APIs used for scroll reveal, scroll spy, deep links, and theme detection.
// Tests can drive them with setIntersecting, setViewportWidth, and setMediaFeature from ./browserMocks.
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
vi.stubGlobal('matchMedia', vi.fn(matchMediaMock))

window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
Element.prototype.scrollIntoView = vi.fn()
