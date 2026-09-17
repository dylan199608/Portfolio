/**
 * Copies text to the clipboard. Uses the async Clipboard API when available and falls back to a hidden
 * <textarea> + execCommand('copy') for older browsers and insecure (http) contexts.
 * Resolves to true on success; never throws.
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Permission denied or document not focused: try the legacy path below.
    }
  }
  return legacyCopy(text)
}

function legacyCopy(text: string): boolean {
  if (typeof document === 'undefined' || !document.body) return false

  const previouslyFocused = document.activeElement
  const selection = document.getSelection()
  const previousRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.setAttribute('aria-hidden', 'true')
  textarea.tabIndex = -1
  Object.assign(textarea.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '1px',
    height: '1px',
    padding: '0',
    border: '0',
    opacity: '0',
    pointerEvents: 'none',
    // 16px avoids the iOS zoom-on-focus behavior.
    fontSize: '16px',
  })

  document.body.appendChild(textarea)
  let copied = false
  try {
    textarea.select()
    textarea.setSelectionRange(0, text.length)
    copied = document.execCommand('copy')
  } catch {
    copied = false
  } finally {
    textarea.remove()
    if (selection && previousRange) {
      selection.removeAllRanges()
      selection.addRange(previousRange)
    }
    if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus({ preventScroll: true })
  }
  return copied
}
