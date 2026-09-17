const SEPARATOR = ' — '

/**
 * Splits the headline at its first spaced em dash into a lead and an emphasized tail:
 * "I find where models get things wrong — and build the checks…" → ["I find where…", "and build the checks…"].
 * Returns a null tail when the headline has no separator.
 */
export function splitHeadline(headline: string): [lead: string, tail: string | null] {
  const index = headline.indexOf(SEPARATOR)
  if (index === -1) return [headline, null]
  return [headline.slice(0, index), headline.slice(index + SEPARATOR.length)]
}
