import { act } from '@testing-library/react'

/**
 * Controllable stand-ins for browser APIs that jsdom lacks. setup.ts installs them for every test file; tests drive
 * them through the helpers below (each helper wraps its updates in act()).
 */

// ---------------------------------------------------------------------------------------------------------------------
// matchMedia
// ---------------------------------------------------------------------------------------------------------------------

/** jsdom's default window.innerWidth. */
export const DEFAULT_VIEWPORT_WIDTH = 1024
const ROOT_FONT_SIZE_PX = 16

interface TrackedQuery {
  query: string
  matches: boolean
  listeners: Set<EventListenerOrEventListenerObject>
  list: MediaQueryList
}

const trackedQueries = new Set<TrackedQuery>()
/** Media features other than width, e.g. prefers-color-scheme → dark. */
const mediaFeatures = new Map<string, string>()

function toPx(length: string): number {
  const value = Number.parseFloat(length)
  return /r?em\s*$/.test(length) ? value * ROOT_FONT_SIZE_PX : value
}

/** Evaluates one condition: (min-width: 48rem), (max-width: 767px), (prefers-color-scheme: dark), (hover), ... */
function evaluateCondition(condition: string): boolean {
  const match = /^\(\s*([\w-]+)\s*(?::\s*([^)]+?))?\s*\)$/.exec(condition.trim())
  if (!match) return false
  const [, feature = '', value] = match

  if (feature === 'min-width' && value) return window.innerWidth >= toPx(value)
  if (feature === 'max-width' && value) return window.innerWidth <= toPx(value)

  const current = mediaFeatures.get(feature)
  if (value === undefined) return current !== undefined && current !== 'no-preference'
  return current === value
}

function evaluateQuery(query: string): boolean {
  return query
    .split(/\s+and\s+/)
    .filter((part) => part.trim() !== 'screen' && part.trim() !== 'all')
    .every(evaluateCondition)
}

function notify(listener: EventListenerOrEventListenerObject, event: Event) {
  if (typeof listener === 'function') listener(event)
  else listener.handleEvent(event)
}

/** Drop-in window.matchMedia: each call returns a list whose `matches` and change events follow the mock state. */
export function matchMediaMock(query: string): MediaQueryList {
  const listeners = new Set<EventListenerOrEventListenerObject>()
  const list = {
    media: query,
    get matches() {
      return evaluateQuery(query)
    },
    onchange: null,
    addListener: (listener: EventListener | null) => {
      if (listener) listeners.add(listener)
    },
    removeListener: (listener: EventListener | null) => {
      if (listener) listeners.delete(listener)
    },
    addEventListener: (type: string, listener: EventListenerOrEventListenerObject | null) => {
      if (type === 'change' && listener) listeners.add(listener)
    },
    removeEventListener: (type: string, listener: EventListenerOrEventListenerObject | null) => {
      if (type === 'change' && listener) listeners.delete(listener)
    },
    dispatchEvent: () => true,
  } as unknown as MediaQueryList

  trackedQueries.add({ query, matches: evaluateQuery(query), listeners, list })
  return list
}

/** Fires `change` on every query whose result differs from the last one its listeners saw. */
function dispatchMediaChanges() {
  for (const tracked of trackedQueries) {
    const matches = evaluateQuery(tracked.query)
    if (matches === tracked.matches) continue
    tracked.matches = matches
    const event = Object.assign(new Event('change'), { matches, media: tracked.query })
    tracked.listeners.forEach((listener) => notify(listener, event))
    const { onchange } = tracked.list
    if (onchange) onchange.call(tracked.list, event as MediaQueryListEvent)
  }
}

/** Resizes the jsdom viewport, then fires `resize` and any width media query changes. */
export function setViewportWidth(width: number) {
  act(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width })
    window.dispatchEvent(new Event('resize'))
    dispatchMediaChanges()
  })
}

/** Sets a media feature such as ('prefers-color-scheme', 'dark') and fires the matching change events. */
export function setMediaFeature(feature: string, value: string | null) {
  act(() => {
    if (value === null) mediaFeatures.delete(feature)
    else mediaFeatures.set(feature, value)
    dispatchMediaChanges()
  })
}

/** Restores the default viewport and features without firing events (components are about to unmount). */
export function resetMediaMocks() {
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: DEFAULT_VIEWPORT_WIDTH })
  mediaFeatures.clear()
  trackedQueries.clear()
}

// ---------------------------------------------------------------------------------------------------------------------
// IntersectionObserver
// ---------------------------------------------------------------------------------------------------------------------

const liveObservers = new Set<MockIntersectionObserver>()

export class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin: string
  readonly scrollMargin = ''
  readonly thresholds: readonly number[]
  readonly callback: IntersectionObserverCallback
  readonly targets = new Set<Element>()

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.rootMargin = options?.rootMargin ?? '0px 0px 0px 0px'
    const threshold = options?.threshold ?? 0
    this.thresholds = Array.isArray(threshold) ? threshold : [threshold]
    liveObservers.add(this)
  }

  observe(target: Element) {
    this.targets.add(target)
  }

  unobserve(target: Element) {
    this.targets.delete(target)
  }

  disconnect() {
    this.targets.clear()
    liveObservers.delete(this)
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

/** Reports `target` as entering (or leaving) the viewport to every observer watching it. */
export function setIntersecting(target: Element, isIntersecting = true) {
  act(() => {
    for (const observer of [...liveObservers]) {
      if (!observer.targets.has(target)) continue
      const rect = target.getBoundingClientRect()
      const entry: IntersectionObserverEntry = {
        target,
        isIntersecting,
        intersectionRatio: isIntersecting ? 1 : 0,
        boundingClientRect: rect,
        intersectionRect: rect,
        rootBounds: null,
        time: performance.now(),
      }
      observer.callback([entry], observer)
    }
  })
}
