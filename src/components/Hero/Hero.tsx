import { lazy, Suspense, useEffect, useMemo, useRef } from 'react'
import { ArrowRight, FileText, Github, Linkedin } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useDevice } from '../../hooks/useDevice'
import { useInView } from '../../hooks/useInView'
import { links } from '../../data/experience'
import { hasWebGL } from '../../utils/webgl'
import { Canvas3DBoundary } from '../Canvas3DBoundary'

gsap.registerPlugin(ScrollTrigger)

const HeroScene = lazy(() => import('./HeroScene'))

export function Hero() {
  const device = useDevice()
  const section = useRef<HTMLElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const scene = useRef<HTMLDivElement>(null)
  const { ref: viewRef, inView } = useInView<HTMLDivElement>('0px')
  const webgl = useMemo(() => hasWebGL(), [])

  // Entrance timeline + scroll parallax. Skipped entirely for reduced motion.
  useEffect(() => {
    if (device.reducedMotion || !content.current) return
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-in]', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.1,
      })
      if (!device.isMobile && scene.current && section.current) {
        gsap.to(scene.current, {
          yPercent: 12,
          opacity: 0.25,
          ease: 'none',
          scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      }
    }, section)
    return () => ctx.revert()
  }, [device.reducedMotion, device.isMobile])

  return (
    <section ref={section} id="top" className="relative flex min-h-[100svh] items-center overflow-hidden" aria-labelledby="hero-title">
      <div ref={viewRef} className="absolute inset-0">
        <div ref={scene} className="absolute inset-0 lg:left-[34%]" aria-hidden="true">
          {webgl && (
            <Canvas3DBoundary>
              <Suspense fallback={null}>
                <HeroScene device={device} active={inView} eventSource={section as React.RefObject<HTMLElement>} />
              </Suspense>
            </Canvas3DBoundary>
          )}
        </div>
      </div>
      {/* readability scrim behind the text */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/55 to-transparent md:from-ink-950/80 md:via-ink-950/30"
        aria-hidden="true"
      />

      <div ref={content} className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-28 sm:px-8">
        <div className="max-w-2xl">
          <p data-hero-in className="eyebrow">
            SAP BTP · Integration Suite · S/4HANA
          </p>
          <h1
            id="hero-title"
            data-hero-in
            className="mt-4 font-display text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-7xl"
          >
            Himanshu Singh
          </h1>
          <p data-hero-in className="mt-4 font-display text-xl font-medium text-cyanx-300 sm:text-2xl">
            SAP BTP Integration Engineer
          </p>
          <p data-hero-in className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Designing enterprise integrations across SAP S/4HANA, SAP CPI, APIs, cloud platforms and external systems.
          </p>

          <div data-hero-in className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#projects" className="btn-primary">
              Explore My Work <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a href={links.resume} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <FileText size={16} aria-hidden="true" /> View Resume
            </a>
            <div className="ml-1 flex items-center gap-2">
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="Himanshu Singh on LinkedIn">
                <Linkedin size={17} />
              </a>
              <a href={links.github} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="Himanshu Singh on GitHub">
                <Github size={17} />
              </a>
            </div>
          </div>

          <dl data-hero-in className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {[
              ['125+', 'CPI interfaces'],
              ['20+', 'PI/PO migrations'],
              ['0', 'downtime go-lives'],
            ].map(([v, l]) => (
              <div key={l} className="flex items-baseline gap-2">
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-2xl font-semibold text-white">{v}</dd>
                <span className="text-slate-400" aria-hidden="true">
                  {l}
                </span>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
