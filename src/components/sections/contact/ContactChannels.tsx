import { ArrowUpRight, Download, FileText, MapPin, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { profile } from '../../../data/resume'
import { cn } from '../../../lib/cn'
import { LinkedInIcon } from '../../ui/icons'
import { rowShape } from './rowShape'

type ChannelAction = 'external' | 'download' | 'call'

interface Channel {
  id: string
  label: string
  value: ReactNode
  icon: ReactNode
  /** Rows without a link render as static text. */
  link?: { href: string; action: ChannelAction }
}

function getChannels(): Channel[] {
  const channels: Channel[] = []

  // Phone leads the list: after email it is the most direct way to reach Dylan.
  if (profile.showPhone) {
    channels.push({
      id: 'phone',
      label: 'Phone',
      value: profile.phone,
      icon: <Phone aria-hidden="true" className="size-4" />,
      link: { href: `tel:${profile.phone.replace(/[^\d+]/g, '')}`, action: 'call' },
    })
  }

  channels.push(
    {
      id: 'linkedin',
      label: 'LinkedIn',
      value: profile.linkedinHandle,
      icon: <LinkedInIcon className="size-3.5" />,
      link: { href: profile.linkedin, action: 'external' },
    },
    {
      id: 'resume',
      label: 'Resume',
      value: (
        <>
          PDF{' '}
          <span aria-hidden="true" className="text-fg-subtle">
            ·
          </span>{' '}
          Download
        </>
      ),
      icon: <FileText aria-hidden="true" className="size-4" />,
      link: { href: profile.resumeUrl, action: 'download' },
    },
    {
      id: 'location',
      label: 'Location',
      value: profile.location,
      icon: <MapPin aria-hidden="true" className="size-4" />,
    },
  )

  return channels
}

export function ContactChannels() {
  const channels = getChannels()
  return (
    <ul className="divide-y divide-line rounded-2xl border border-line bg-surface-2/60">
      {channels.map((channel, index) => (
        <li key={channel.id}>
          <ChannelRow channel={channel} shape={rowShape(index, channels.length)} />
        </li>
      ))}
    </ul>
  )
}

interface ChannelRowProps {
  channel: Channel
  shape: string
}

function ChannelRow({ channel, shape }: ChannelRowProps) {
  const { link } = channel
  const body = (
    <>
      <span
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-fg-muted',
          link && 'transition-colors duration-200 group-hover:border-line-strong group-hover:text-fg',
        )}
      >
        {channel.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-xs tracking-[0.16em] text-fg-subtle uppercase">
          {channel.label}
        </span>
        <span className="mt-0.5 block text-sm text-fg [overflow-wrap:anywhere]">{channel.value}</span>
      </span>
    </>
  )

  const rowClasses = 'flex items-center gap-4 px-5 py-4'

  if (!link) {
    return <div className={cn(rowClasses, shape)}>{body}</div>
  }

  const trailingIcon =
    link.action === 'download' ? (
      <Download
        aria-hidden="true"
        className="size-4 shrink-0 text-fg-subtle transition duration-200 motion-safe:group-hover:translate-y-0.5 group-hover:text-accent"
      />
    ) : (
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 shrink-0 text-fg-subtle transition duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 group-hover:text-accent"
      />
    )

  const external = link.action === 'external'

  return (
    <a
      href={link.href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      download={link.action === 'download' ? true : undefined}
      className={cn(
        rowClasses,
        shape,
        'group transition-colors duration-200 hover:bg-line/50 focus-visible:-outline-offset-2',
      )}
    >
      {body}
      {external ? <span className="sr-only"> (opens in new tab)</span> : null}
      {trailingIcon}
    </a>
  )
}
