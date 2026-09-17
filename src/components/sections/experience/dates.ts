const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

/** "Jun 2024" -> "2024-06" for a machine-readable <time>; undefined for labels such as "Present". */
export function toDateTime(label: string): string | undefined {
  const match = /^([a-z]{3})[a-z]*\.?\s+(\d{4})$/i.exec(label.trim())
  if (!match) return undefined
  const [, mon, year] = match
  if (!mon || !year) return undefined
  const month = MONTHS.indexOf(mon.toLowerCase())
  return month === -1 ? undefined : `${year}-${String(month + 1).padStart(2, '0')}`
}
