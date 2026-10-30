import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../../types'
import { kindColor } from '../../utils/colors'
import { useDevice } from '../../hooks/useDevice'
import { IntegrationArchitecture } from '../ArchitectureGraph/IntegrationArchitecture'

const px = (x: number) => 50 + x * 42
const py = (y: number) => 50 + y * 36

function MiniArchitecture({ project, hot }: { project: Project; hot: boolean }) {
  const { nodes, edges } = project.architecture
  const byId = new Map(nodes.map((n) => [n.id, n]))
  return (
    <div className="relative aspect-[100/56] w-full [transform-style:preserve-3d]" aria-hidden="true">
      <svg viewBox="0 0 100 56" className="depth-2 absolute inset-0 h-full w-full">
        {edges.map((e, i) => {
          const a = byId.get(e.from)
          const b = byId.get(e.to)
          if (!a || !b) return null
          const [x1, y1, x2, y2] = [px(a.x), py(a.y) * 0.56, px(b.x), py(b.y) * 0.56]
          const c = kindColor[a.kind]
          return (
            <g key={`${e.from}-${e.to}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={hot ? c : '#2c3d5c'}
                strokeWidth={hot ? 0.7 : 0.45}
                style={{ transition: 'stroke 0.3s', filter: hot ? `drop-shadow(0 0 1.2px ${c})` : undefined }}
              />
              {hot && (
                <circle r={1.15} fill={c}>
                  <animateMotion dur="1.8s" begin={`${i * 0.25}s`} repeatCount="indefinite" path={`M${x1} ${y1} L${x2} ${y2}`} />
                </circle>
              )}
            </g>
          )
        })}
      </svg>
      {nodes.map((n, i) => {
        const c = kindColor[n.kind]
        return (
          <div
            key={n.id}
            className="depth-2 absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${px(n.x)}%`, top: `${(py(n.y) * 0.56) / 0.56}%` }}
          >
            <span
              className="h-5 w-5 rounded-md border transition-all duration-300"
              style={{
                borderColor: c,
                background: hot ? `${c}55` : `${c}22`,
                boxShadow: hot ? `0 0 14px ${c}99` : 'none',
                transitionDelay: `${i * 30}ms`,
              }}
            />
            <span className="mt-1 whitespace-nowrap font-mono text-[9px] text-slate-400">{n.label}</span>
          </div>
        )
      })}
    </div>
  )
}

interface Props {
  project: Project
  /** Larger card with a live, clickable WebGL architecture. */
  featured?: boolean
}

export function ProjectCard3D({ project, featured = false }: Props) {
  const device = useDevice()
  const ref = useRef<HTMLElement>(null)
  const [hot, setHot] = useState(false)
  const tiltEnabled = !device.isMobile && !device.reducedMotion && !featured
  const live = featured && !device.isMobile && device.tier !== 'low' && !device.reducedMotion

  const onMove = (e: React.PointerEvent) => {
    if (!tiltEnabled || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.setProperty('--ry', `${x * 10}deg`)
    ref.current.style.setProperty('--rx', `${-y * 8}deg`)
  }
  const reset = () => {
    setHot(false)
    ref.current?.style.setProperty('--ry', '0deg')
    ref.current?.style.setProperty('--rx', '0deg')
  }

  return (
    <div className="card3d-wrap h-full">
      <article
        ref={ref}
        className="card3d glass relative flex h-full flex-col rounded-3xl p-5 sm:p-6"
        onPointerEnter={() => setHot(true)}
        onPointerMove={onMove}
        onPointerLeave={reset}
        onFocus={() => setHot(true)}
        onBlur={reset}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-xs text-cyanx-400">PROJECT {project.index}</span>
          <ArrowUpRight size={18} className="text-slate-500" aria-hidden="true" />
        </div>

        <div className="rounded-2xl border border-white/5 bg-ink-900/70 p-3 [transform-style:preserve-3d]">
          {live ? (
            <IntegrationArchitecture architecture={project.architecture} height={250} flow={hot} showPanel={false} />
          ) : (
            <MiniArchitecture project={project} hot={hot} />
          )}
        </div>

        <div className="depth-1 mt-5 flex flex-1 flex-col">
          <p className="text-xs uppercase tracking-widest text-slate-500">{project.tagline}</p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-white">
            <Link
              to={`/projects/${project.slug}`}
              className={featured ? '' : "after:absolute after:inset-0 after:content-[''] after:rounded-3xl"}
            >
              {project.title}
            </Link>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{project.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.tech.slice(0, 6).map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
            {project.tech.length > 6 && <li className="chip">+{project.tech.length - 6}</li>}
          </ul>
          {featured && (
            <Link to={`/projects/${project.slug}`} className="btn-ghost mt-5 self-start">
              Open project details <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          )}
        </div>
      </article>
    </div>
  )
}
