import { useState } from 'react'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import { incidents } from '../../data/incidents'
import { Reveal, SectionHeading } from '../Reveal'

export function Troubleshooting() {
  const [code, setCode] = useState(incidents[0].code)
  const sel = incidents.find((i) => i.code === code) ?? incidents[0]

  return (
    <section id="production" className="section" aria-labelledby="prod-title">
      <SectionHeading
        eyebrow="Production Reality"
        title="What actually breaks in production"
        lead="Live interfaces fail in predictable ways. These are the incident types I have worked through, with the checks I run first."
      />
      <h2 id="prod-title" className="sr-only">
        Production Reality
      </h2>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2" aria-label="Incident types">
          {incidents.map((inc, i) => {
            const active = inc.code === code
            return (
              <li key={inc.code}>
                <Reveal delay={i * 0.03}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCode(inc.code)}
                    className={`group w-full rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? 'border-rose-400/60 bg-rose-400/10 shadow-[0_0_30px_-10px_rgba(251,113,133,0.6)]'
                        : 'border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-white/25'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span className="font-mono text-xl font-semibold text-rose-300">{inc.code}</span>
                      <ChevronRight size={16} className={active ? 'text-rose-300' : 'text-slate-600'} aria-hidden="true" />
                    </span>
                    <span className="mt-1 block text-sm text-slate-300">{inc.title}</span>
                  </button>
                </Reveal>
              </li>
            )
          })}
        </ul>

        <div className="glass rounded-3xl p-6 lg:sticky lg:top-24 lg:self-start" aria-live="polite">
          <p className="font-mono text-[11px] uppercase tracking-widest text-rose-300">Incident</p>
          <h3 className="mt-1 font-display text-2xl font-semibold text-white">
            <span className="font-mono text-rose-300">{sel.code}</span> {sel.title}
          </h3>

          <h4 className="mt-6 text-xs font-semibold uppercase tracking-widest text-slate-500">Possible causes</h4>
          <ul className="mt-2 space-y-2">
            {sel.causes.map((c) => (
              <li key={c} className="flex gap-2 text-sm text-slate-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-300" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>

          <h4 className="mt-6 text-xs font-semibold uppercase tracking-widest text-slate-500">Resolution</h4>
          <p className="mt-2 flex gap-2 text-sm leading-relaxed text-slate-200">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" aria-hidden="true" />
            {sel.resolution}
          </p>
        </div>
      </div>
    </section>
  )
}
