/**
 * Bento placement for the card at `index` of `total`.
 * - md (2 columns): the featured group spans the full row; the rest pair up. Below md, cards stack.
 * - lg (3 columns): the featured group fills a 2×2 block beside the next two groups. The remaining groups mirror that
 *   block in rows of one narrow and one wide card, so every row closes flush.
 * An unpaired last card (even `total`) spans the full row at both breakpoints. Supports `total` of 3 or more.
 */
export function placement(index: number, total: number): string | undefined {
  if (index === 0) return 'md:col-span-2 lg:row-span-2'
  if (index < 3) return undefined

  const unpairedLast = total % 2 === 0 && index === total - 1
  if (unpairedLast) return 'md:col-span-2 lg:col-span-3'
  return (index - 3) % 2 === 1 ? 'lg:col-span-2' : undefined
}
