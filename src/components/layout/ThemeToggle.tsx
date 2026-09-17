import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../lib/cn'
import { EASE_OUT } from '../../lib/motion'

interface ThemeToggleProps {
  className?: string
}

/** Icon button that flips between the light and dark themes. Shows the theme you would switch to. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const Icon = isDark ? Sun : Moon

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'relative inline-grid size-10 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-lg text-fg-muted transition-colors duration-200 hover:bg-surface-2 hover:text-fg md:size-9',
        className,
      )}
    >
      <AnimatePresence initial={false}>
        <m.span
          key={theme}
          className="absolute inset-0 grid place-items-center"
          initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <Icon aria-hidden="true" className="size-[18px]" />
        </m.span>
      </AnimatePresence>
    </button>
  )
}
