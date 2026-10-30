import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar/Navbar'
import { Footer } from './components/Footer'
import Home from './pages/Home'

const ProjectDetails = lazy(() => import('./pages/ProjectDetails'))
const FishScene = lazy(() => import('./three/FishScene'))

/** Scrolls to top on route change, or to the #hash target when one is present. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-md bg-cyanx-400 px-4 py-2 font-semibold text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Suspense fallback={null}>
        <FishScene />
      </Suspense>
      <Navbar />
      <ScrollManager />
      <main id="main" className="relative z-10">
        <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
