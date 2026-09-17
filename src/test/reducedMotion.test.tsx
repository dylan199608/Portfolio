import { act, fireEvent, screen, within } from '@testing-library/react'
import { useInView, useReducedMotion } from 'motion/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GuardrailConsole } from '../components/sections/hero/GuardrailConsole'
import { FINAL_PHASE, PIPELINE_STEPS, phaseDelay } from '../components/sections/hero/pipeline'
import { ProjectFlow } from '../components/sections/projects/ProjectFlow'
import { projects } from '../data/resume'
import { renderWithMotion } from './render'

vi.mock(import('motion/react'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
    useInView: vi.fn(() => false),
  }
})

const STEP_COUNT = PIPELINE_STEPS.length

beforeEach(() => {
  vi.mocked(useReducedMotion).mockReturnValue(false)
  vi.mocked(useInView).mockReturnValue(false)
})

afterEach(() => {
  vi.useRealTimers()
})

function getConsole() {
  // Browsers name a figure from its figcaption; dom-accessibility-api does not, so query without a name.
  return screen.getByRole('figure')
}

/** The console's visuals are aria-hidden (the figcaption describes them), so read them as text. */
function expectFinalState(figure: HTMLElement) {
  const view = within(figure)
  expect(view.getByText(`${STEP_COUNT}/${STEP_COUNT}`)).toBeInTheDocument()
  expect(view.getByText('passed')).toBeInTheDocument()
  for (const label of ['running', 'queued', 'waiting', 'writing']) {
    expect(view.queryByText(label), label).not.toBeInTheDocument()
  }
  const results = new Set(PIPELINE_STEPS.map((step) => step.result))
  for (const result of results) {
    const expected = PIPELINE_STEPS.filter((step) => step.result === result).length
    expect(view.getAllByText(result), result).toHaveLength(expected)
  }
}

/**
 * Advances the fake clock phase by phase up to the finished state. Each phase needs its own act(): the next timer is
 * only scheduled once React has re-rendered.
 */
function playThrough(isReplay: boolean, fromPhase = -1) {
  for (let phase = fromPhase; phase < FINAL_PHASE; phase++) {
    act(() => {
      vi.advanceTimersByTime(phaseDelay(phase, isReplay))
    })
  }
}

describe('GuardrailConsole', () => {
  it('renders the finished pipeline immediately when reduced motion is preferred', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    vi.mocked(useReducedMotion).mockReturnValue(true)
    vi.mocked(useInView).mockReturnValue(true)

    renderWithMotion(<GuardrailConsole />)

    const figure = getConsole()
    expect(figure.querySelector('figcaption')).toHaveTextContent(/^Illustration: an LLM response/)
    for (const step of PIPELINE_STEPS) expect(within(figure).getByText(step.label)).toBeInTheDocument()
    expectFinalState(figure)
    // Nothing is sequenced, so there is nothing to replay and no timer left running.
    expect(screen.queryByRole('button', { name: 'Replay animation' })).not.toBeInTheDocument()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('waits at the start until it scrolls into view', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })

    renderWithMotion(<GuardrailConsole />)
    act(() => {
      vi.advanceTimersByTime(60_000)
    })

    const view = within(getConsole())
    expect(view.getByText(`0/${STEP_COUNT}`)).toBeInTheDocument()
    expect(view.getByText('waiting')).toBeInTheDocument()
    expect(view.queryByText('passed')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Replay animation' })).not.toBeInTheDocument()
  })

  it('plays the sequence once in view, then offers a replay', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    vi.mocked(useInView).mockReturnValue(true)

    renderWithMotion(<GuardrailConsole />)
    const figure = getConsole()

    act(() => {
      vi.advanceTimersByTime(phaseDelay(-1, false) - 1)
    })
    expect(within(figure).getByText('waiting')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(within(figure).getAllByText('running').length).toBeGreaterThan(0)
    expect(within(figure).getByText(`0/${STEP_COUNT}`)).toBeInTheDocument()

    playThrough(false, 0)
    expectFinalState(figure)
    expect(vi.getTimerCount()).toBe(0)

    const replay = screen.getByRole('button', { name: 'Replay animation' })
    expect(replay).toHaveAttribute('aria-disabled', 'false')

    fireEvent.click(replay)

    expect(within(figure).getByText(`0/${STEP_COUNT}`)).toBeInTheDocument()
    // The button stays mounted while replaying so focus is never lost; it is only marked disabled.
    expect(screen.getByRole('button', { name: 'Replay animation' })).toBe(replay)
    expect(replay).toHaveAttribute('aria-disabled', 'true')

    // A replay starts after a shorter pause. Clicks while it is still running are ignored.
    act(() => {
      vi.advanceTimersByTime(phaseDelay(-1, true))
    })
    act(() => {
      vi.advanceTimersByTime(phaseDelay(0, true))
    })
    expect(within(figure).getByText(`1/${STEP_COUNT}`)).toBeInTheDocument()
    fireEvent.click(replay)
    expect(within(figure).getByText(`1/${STEP_COUNT}`)).toBeInTheDocument()

    playThrough(true, 1)
    expectFinalState(figure)
    expect(replay).toHaveAttribute('aria-disabled', 'false')
  })
})

describe('ProjectFlow', () => {
  const project = projects[0]
  if (!project) throw new Error('resume.ts has no projects')

  it('shows every step without waiting for a scroll animation when reduced motion is preferred', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)

    renderWithMotion(<ProjectFlow title={project.title} steps={project.flow} />)

    const flow = screen.getByRole('list', { name: `${project.title} system flow` })
    const items = within(flow).getAllByRole('listitem')
    expect(items).toHaveLength(project.flow.length)
    for (const item of items) expect(item).toBeVisible()
  })

  it('hides the steps until the flow scrolls into view otherwise', () => {
    renderWithMotion(<ProjectFlow title={project.title} steps={project.flow} />)

    const flow = screen.getByRole('list', { name: `${project.title} system flow` })
    for (const item of within(flow).getAllByRole('listitem')) expect(item).not.toBeVisible()
  })

  it('labels check steps for screen readers', () => {
    renderWithMotion(<ProjectFlow title={project.title} steps={project.flow} />)

    const items = within(screen.getByRole('list', { name: `${project.title} system flow` })).getAllByRole('listitem')
    project.flow.forEach((step, i) => {
      const item = items[i] as HTMLElement
      expect(item).toHaveTextContent(step.label)
      if (step.check) expect(item).toHaveTextContent('(check step)')
      else expect(item).not.toHaveTextContent('(check step)')
    })
  })
})
