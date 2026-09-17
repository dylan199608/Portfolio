import { useEffect } from 'react'

const USER_INPUT_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const

/** The fragment without its '#', decoded. A malformed escape (e.g. /#%E0%A4%A) yields '' instead of throwing. */
function decodeHash(hash: string): string {
  try {
    return decodeURIComponent(hash.slice(1))
  } catch {
    return ''
  }
}

/**
 * Scrolls to the URL fragment (e.g. /#contact) once the app has mounted. The browser's own fragment scroll runs
 * before React renders the sections, so without this a deep link opens at the top of the page.
 */
export function useHashScroll() {
  useEffect(() => {
    const id = decodeHash(window.location.hash)
    const target = id ? document.getElementById(id) : null
    // A non-zero scroll means the browser already scrolled or restored the position (or this is StrictMode's
    // second effect run), so leave it alone.
    if (!target || window.scrollY !== 0) return

    let userMoved = false
    const onInput = () => {
      userMoved = true
    }
    USER_INPUT_EVENTS.forEach((type) => window.addEventListener(type, onInput, { passive: true }))

    // 'instant' bypasses html { scroll-behavior: smooth }; scroll-padding and scroll-margin still apply.
    const scroll = () => target.scrollIntoView({ behavior: 'instant', block: 'start' })
    scroll()

    // Web fonts swap in after the first scroll and shift the layout (by up to ~285px on mobile), so scroll again
    // once they are ready, unless the visitor has started scrolling on their own. There is deliberately no cleanup:
    // App never unmounts, and cancelling here would drop the re-scroll under StrictMode's double effect run.
    const fontsReady = 'fonts' in document ? document.fonts.ready : Promise.resolve()
    void fontsReady.then(() =>
      requestAnimationFrame(() => {
        USER_INPUT_EVENTS.forEach((type) => window.removeEventListener(type, onInput))
        if (!userMoved) scroll()
      }),
    )
  }, [])
}
