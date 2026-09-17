import { domAnimation, LazyMotion, MotionConfig } from 'motion/react'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Education } from './components/sections/Education'
import { Experience } from './components/sections/Experience'
import { Hero } from './components/sections/Hero'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'
import { useHashScroll } from './hooks/useHashScroll'

export default function App() {
  useHashScroll()

  return (
    <MotionConfig reducedMotion="user">
      {/* domAnimation covers everything the site animates; `m` components rely on it (no drag or layout features). */}
      <LazyMotion features={domAnimation}>
        <a
          href="#main"
          className="sr-only z-[100] rounded-lg bg-accent text-sm font-medium text-accent-fg focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:px-4 focus:py-2.5"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />
          <About />
          <Projects />
          <Experience />
          <Education />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </LazyMotion>
    </MotionConfig>
  )
}
