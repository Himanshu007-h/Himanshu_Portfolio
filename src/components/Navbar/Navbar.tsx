import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const items = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'lab', label: 'Architecture Lab' },
  { id: 'stack', label: 'Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'production', label: 'Production' },
  { id: 'contact', label: 'Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    if (!onHome) {
      setActive('')
      return
    }
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id))
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [onHome, pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled || open ? 'border-b border-white/10 bg-ink-950/75 backdrop-blur-xl' : ''
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8" aria-label="Primary">
        <Link to="/" className="flex items-center gap-2 font-display text-sm font-semibold tracking-wide text-white">
          <span className="grid h-7 w-7 place-items-center rounded-lg border border-cyanx-400/50 bg-cyanx-400/10 font-mono text-xs text-cyanx-300">
            HS
          </span>
          Himanshu Singh
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {items.map((i) => (
            <li key={i.id}>
              <Link
                to={`/#${i.id}`}
                aria-current={active === i.id ? 'true' : undefined}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  active === i.id ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {i.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="btn-icon lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" className="mx-auto max-w-6xl space-y-1 px-5 pb-5 lg:hidden">
          {items.map((i) => (
            <li key={i.id}>
              <Link to={`/#${i.id}`} className="block rounded-lg px-3 py-3 text-slate-200 hover:bg-white/[0.06]">
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
