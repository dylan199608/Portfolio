/** The site's single easing curve (design brief). */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const

/** Reveal stagger for list items: `step` seconds per item, capped at `max`. */
export function staggerDelay(index: number, step = 0.06, max = 0.3): number {
  return Math.min(index * step, max)
}
