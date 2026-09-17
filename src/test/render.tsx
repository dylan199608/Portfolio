import { render } from '@testing-library/react'
import userEvent, { type Options } from '@testing-library/user-event'
import { domAnimation, LazyMotion, MotionConfig } from 'motion/react'
import type { ReactElement } from 'react'
import App from '../App'

/** Renders the whole page and returns a user-event instance alongside the render result. */
export function renderApp(options?: Options) {
  const user = userEvent.setup(options)
  return { user, ...render(<App />) }
}

/** Renders a single component inside the same motion providers App uses. */
export function renderWithMotion(ui: ReactElement, options?: Options) {
  const user = userEvent.setup(options)
  return {
    user,
    ...render(
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation}>{ui}</LazyMotion>
      </MotionConfig>,
    ),
  }
}
