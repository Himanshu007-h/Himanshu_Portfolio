import { useState } from 'react'
import { labArchitectures } from '../../data/architectures'
import { IntegrationArchitecture } from '../ArchitectureGraph/IntegrationArchitecture'
import { SectionHeading } from '../Reveal'

export function ArchitectureLab() {
  const [activeId, setActiveId] = useState(labArchitectures[0].id)
  const arch = labArchitectures.find((a) => a.id === activeId) ?? labArchitectures[0]

  return (
    <section id="lab" className="section" aria-labelledby="lab-title">
      <SectionHeading
        eyebrow="Showcase"
        title="Integration Architecture Lab"
        lead="Pick an architecture and watch data packets move between the nodes. Click any node to see its role."
      />
      <h2 id="lab-title" className="sr-only">
        Integration Architecture Lab
      </h2>

      <div className="mt-10 grid gap-6 lg:grid-cols-[260px_1fr]">
        <div role="tablist" aria-label="Sample architectures" aria-orientation="vertical" className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {labArchitectures.map((a, i) => {
            const active = a.id === activeId
            return (
              <button
                key={a.id}
                id={`lab-tab-${a.id}`}
                role="tab"
                type="button"
                aria-selected={active}
                aria-controls="lab-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => setActiveId(a.id)}
                onKeyDown={(e) => {
                  const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
                  if (!dir) return
                  e.preventDefault()
                  const n = labArchitectures[(i + dir + labArchitectures.length) % labArchitectures.length]
                  setActiveId(n.id)
                  document.getElementById(`lab-tab-${n.id}`)?.focus()
                }}
                className={`min-w-[220px] rounded-xl border p-4 text-left transition-colors lg:min-w-0 ${
                  active ? 'border-cyanx-400/60 bg-cyanx-400/10' : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                }`}
              >
                <span className="font-mono text-[11px] text-slate-500">ARCH {i + 1}</span>
                <span className="mt-1 block font-display text-sm font-semibold text-white">{a.title}</span>
                <span className="mt-1 block text-xs text-slate-400">{a.subtitle}</span>
              </button>
            )
          })}
        </div>

        <div id="lab-panel" role="tabpanel" aria-labelledby={`lab-tab-${arch.id}`}>
          <IntegrationArchitecture architecture={arch} height={360} flow />
        </div>
      </div>
    </section>
  )
}
