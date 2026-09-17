/** Matches the list's rounded-2xl corners (1rem minus the 1px border) so hover fills and focus rings stay inside. */
export function rowShape(index: number, count: number): string {
  const first = index === 0
  const last = index === count - 1
  if (first && last) return 'rounded-[15px]'
  if (first) return 'rounded-t-[15px] rounded-b-none'
  if (last) return 'rounded-t-none rounded-b-[15px]'
  return 'rounded-none'
}
