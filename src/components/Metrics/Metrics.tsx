import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { metrics } from '../../data/experience'
import { useCountUp } from '../../hooks/useCountUp'
import { useInView } from '../../hooks/useInView'
import { useDevice } from '../../hooks/useDevice'

function Metric({ value, suffix, label, active }: { value: number; suffix: string; label: string; active: boolean }) {
  const reduce = useReducedMotion()
  const device = useDevice()
  const n = useCountUp(value, active, 1500, !!reduce)
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.PointerEvent) => {
    if (device.isMobile || reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`)
    ref.current.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 12}deg`)
  }
  const reset = () => {
    ref.current?.style.setProperty('--ry', '0deg')
    ref.current?.style.setProperty('--rx', '0deg')
  }

  return (
    <div className="card3d-wrap">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="card3d glass relative overflow-hidden rounded-3xl p-6 text-center"
      >
        <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-cyanx-400/20 blur-3xl" aria-hidden="true" />
        <p
          className="depth-3 relative bg-gradient-to-b from-white to-cyanx-300 bg-clip-text font-display text-6xl font-bold text-transparent sm:text-7xl"
          aria-label={`${value}${suffix} ${label}`}
        >
          <span aria-hidden="true">
            {n}
            {suffix}
          </span>
        </p>
        <p className="depth-2 relative mt-2 text-sm text-slate-400">{label}</p>
      </div>
    </div>
  )
}

export function Metrics() {
  const { ref, inView } = useInView<HTMLDivElement>('0px')
  return (
    <section className="section !py-16" aria-label="Key metrics">
      <div ref={ref} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m) => (
          <Metric key={m.label} {...m} active={inView} />
        ))}
      </div>
    </section>
  )
}
