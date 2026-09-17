import type { Role } from '../../../data/resume'
import { cn } from '../../../lib/cn'
import { Tag } from '../../ui/Tag'
import { toDateTime } from './dates'

function DateLabel({ label }: { label: string }) {
  const dateTime = toDateTime(label)
  return dateTime ? <time dateTime={dateTime}>{label}</time> : <span>{label}</span>
}

interface RoleMetaProps {
  role: Role
  className?: string
}

/**
 * Dates, location, and "Current" status for a role.
 * Wraps inline above the title on small screens and stacks in its own column from md up.
 */
export function RoleMeta({ role, className }: RoleMetaProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-2 md:flex-col md:items-start md:gap-0', className)}>
      <p className="font-mono text-sm whitespace-nowrap text-fg">
        <DateLabel label={role.start} />
        <span aria-hidden="true"> – </span>
        <span className="sr-only"> to </span>
        <DateLabel label={role.end} />
      </p>
      <p className="text-sm text-fg-subtle md:mt-1">{role.location}</p>
      {role.current ? (
        <Tag tone="accent" className="gap-1.5 md:mt-3">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          Current
        </Tag>
      ) : null}
    </div>
  )
}
