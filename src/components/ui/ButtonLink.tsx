import type { ComponentProps } from 'react'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonClasses'

interface ButtonLinkProps extends ComponentProps<'a'> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Opens in a new tab with `rel="noopener noreferrer"` and appends visually hidden "(opens in new tab)" text. */
  external?: boolean
}

/** An anchor styled as a button. Use for in-page navigation, mailto: links, downloads, and external links. */
export function ButtonLink({ variant, size, className, external = false, children, ...props }: ButtonLinkProps) {
  return (
    <a
      className={buttonClasses(variant, size, className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
      {external ? <span className="sr-only"> (opens in new tab)</span> : null}
    </a>
  )
}
