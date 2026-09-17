import type { Role } from '../../../data/resume'
import { cn } from '../../../lib/cn'
import { Tag } from '../../ui/Tag'
import { RoleHighlights } from './RoleHighlights'
import { RoleMeta } from './RoleMeta'

interface RoleItemProps {
  role: Role
  isFirst: boolean
  isLast: boolean
}

/**
 * One entry on the experience timeline.
 *
 * The geometry lives in CSS variables on the grid: --meta-col (dates column), --col-gap, and --node-top.
 * The rail sits on the left edge of the content column (x = 0 below md, --meta-col + --col-gap from md up), and its
 * node lines up with the first line of the entry: the dates on small screens, the title from md up. The first role's
 * rail starts at the node's center (--node-top + 6px, half the 12px node).
 *
 * The title comes first in the DOM so it leads for screen readers; the dates are shown above it on small screens
 * (order-first) and beside it from md up.
 */
export function RoleItem({ role, isFirst, isLast }: RoleItemProps) {
  const roleLabel = `${role.title} at ${role.company}`

  return (
    <div
      className={cn(
        'relative grid gap-3 [--col-gap:2.5rem] [--meta-col:200px] [--node-top:0.25rem] md:grid-cols-[var(--meta-col)_minmax(0,1fr)] md:gap-x-(--col-gap) md:gap-y-0 md:[--node-top:0.5rem] lg:[--meta-col:240px]',
        !isLast && 'pb-12 sm:pb-16',
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-px md:left-[calc(var(--meta-col)+var(--col-gap))]"
      >
        <span
          className={cn(
            'absolute inset-x-0 bottom-0 bg-line',
            isFirst ? 'top-[calc(var(--node-top)+6px)]' : 'top-0',
            isLast && '[mask-image:linear-gradient(to_bottom,black_calc(100%_-_4rem),transparent)]',
          )}
        />
        <span
          className={cn(
            'absolute top-(--node-top) left-1/2 size-3 -translate-x-1/2 rounded-full border-2 border-accent ring-4 ring-bg',
            role.current ? 'bg-accent' : 'bg-bg',
          )}
        />
      </div>

      <h3 className="min-w-0 pl-6 text-lg font-semibold tracking-tight text-fg sm:pl-8 sm:text-xl md:col-start-2 md:row-start-1">
        {role.title}
        <span className="sr-only"> at </span>{' '}
        <span className="whitespace-nowrap">
          <span aria-hidden="true" className="mr-2 font-normal text-fg-subtle">
            ·
          </span>
          <span className="font-medium text-accent">{role.company}</span>
        </span>
      </h3>

      <RoleMeta
        role={role}
        className="order-first pl-6 sm:pl-8 md:sticky md:top-24 md:order-none md:col-start-1 md:row-span-2 md:row-start-1 md:self-start md:pt-1 md:pl-0"
      />

      <div className="min-w-0 pl-6 sm:pl-8 md:col-start-2 md:row-start-2">
        <div className="max-w-2xl">
          {/* Below md the grid gap already separates the summary from the title. */}
          <p className="text-base leading-relaxed text-pretty text-fg-muted md:mt-3">{role.summary}</p>

          <RoleHighlights highlights={role.highlights} roleLabel={roleLabel} className="mt-5" />

          <ul aria-label={`Focus areas and tools at ${role.company}`} className="mt-6 flex flex-wrap gap-2">
            {role.tags.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
