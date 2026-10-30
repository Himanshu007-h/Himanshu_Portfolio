import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import type { Architecture } from '../../types'
import { useDevice } from '../../hooks/useDevice'
import { useInView } from '../../hooks/useInView'
import { kindColor, kindLabel } from '../../utils/colors'
import { hasWebGL } from '../../utils/webgl'
import { Canvas3DBoundary } from '../Canvas3DBoundary'
import { ArchScene } from './ArchScene'
import { StaticArchitecture } from './StaticArchitecture'

export interface IntegrationArchitectureProps {
  /** Full architecture definition. */
  architecture?: Architecture
  /** Shorthand for a simple 3-node chain. */
  source?: string
  middleware?: string
  target?: string
  /** Canvas height in px. */
  height?: number
  /** Keep data packets moving all the time (otherwise only on hover / selection). */
  flow?: boolean
  vertical?: boolean
  /** Show the node chips + info panel under the canvas. */
  showPanel?: boolean
  className?: string
}

function fromTriple(source: string, middleware: string, target: string): Architecture {
  return {
    id: `${source}-${middleware}-${target}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: `${source} → ${middleware} → ${target}`,
    subtitle: '',
    nodes: [
      { id: 'source', label: source, kind: 'system', x: -0.85, y: 0, info: `${source} is the source system that triggers or provides the data.` },
      {
        id: 'middleware',
        label: middleware,
        kind: 'middleware',
        x: 0,
        y: 0,
        info: `${middleware} acts as the middleware layer responsible for routing, transformation, authentication and orchestration.`,
      },
      { id: 'target', label: target, kind: 'file', x: 0.85, y: 0, info: `${target} is the receiving endpoint of the integration.` },
    ],
    edges: [
      { from: 'source', to: 'middleware' },
      { from: 'middleware', to: 'target' },
    ],
  }
}

/**
 * Reusable interactive 3D integration architecture.
 *
 *   <IntegrationArchitecture source="SAP S/4HANA" middleware="SAP CPI" target="Bank SFTP" />
 *
 * Nodes are clickable in 3D and also reachable by keyboard through the chip list below the canvas.
 * Falls back to an accessible SVG rendering when WebGL is unavailable.
 */
export function IntegrationArchitecture({
  architecture,
  source = 'SAP S/4HANA',
  middleware = 'SAP CPI',
  target = 'Bank SFTP',
  height = 340,
  flow = false,
  vertical,
  showPanel = true,
  className = '',
}: IntegrationArchitectureProps) {
  const device = useDevice()
  const { ref, inView } = useInView<HTMLDivElement>('300px')
  const [seen, setSeen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)

  const arch = useMemo(
    () => architecture ?? fromTriple(source, middleware, target),
    [architecture, source, middleware, target],
  )
  const isVertical = vertical ?? device.isMobile
  const webgl = useMemo(() => hasWebGL(), [])

  useEffect(() => {
    if (inView) setSeen(true)
  }, [inView])
  useEffect(() => setSelectedId(null), [arch.id])

  const selected = arch.nodes.find((n) => n.id === selectedId) ?? null
  const chips = arch.nodes.filter((n, i, all) => all.findIndex((m) => m.label === n.label) === i)
  const canvasHeight = isVertical ? Math.max(height, 140 + arch.nodes.length * 62) : height

  const fallback = <StaticArchitecture architecture={arch} selectedId={selectedId} onSelect={setSelectedId} />

  return (
    <div className={className}>
      <div
        ref={ref}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60"
        style={{ height: canvasHeight, touchAction: 'pan-y' }}
        role="group"
        aria-label={`3D architecture diagram: ${arch.title}`}
      >
        {webgl && seen ? (
          <Canvas3DBoundary fallback={fallback}>
            <Canvas
              dpr={device.dpr}
              frameloop={inView ? 'always' : 'never'}
              camera={{ position: [0, 0, 8], fov: 40 }}
              gl={{ antialias: device.tier !== 'low', alpha: true, powerPreference: 'high-performance' }}
              style={{ touchAction: 'pan-y' }}
            >
              <ambientLight intensity={0.8} />
              <directionalLight position={[3, 4, 5]} intensity={1.2} />
              <pointLight position={[-4, -2, 3]} intensity={0.7} color="#7c6cff" />
              <ArchScene
                arch={arch}
                vertical={isVertical}
                flow={flow && !device.reducedMotion}
                selectedId={selectedId}
                hoverId={hoverId}
                animate={!device.reducedMotion}
                tilt={!device.reducedMotion && !device.isMobile}
                particles={device.tier === 'low' ? 2 : 4}
                onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}
                onHover={setHoverId}
              />
            </Canvas>
          </Canvas3DBoundary>
        ) : !webgl ? (
          fallback
        ) : null}
      </div>

      {showPanel && (
        <>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Architecture nodes">
            {chips.map((n) => {
              const active = selected?.label === n.label
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setSelectedId(active ? null : n.id)}
                  onMouseEnter={() => setHoverId(n.id)}
                  onMouseLeave={() => setHoverId(null)}
                  aria-pressed={active}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${
                    active
                      ? 'border-cyanx-400/70 bg-cyanx-400/10 text-white'
                      : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: kindColor[n.kind] }} aria-hidden="true" />
                  {n.label}
                </button>
              )
            })}
          </div>
          <div
            className="glass mt-3 min-h-[5.5rem] rounded-xl p-4 text-sm leading-relaxed text-slate-300"
            aria-live="polite"
          >
            {selected ? (
              <>
                <p className="mb-1 font-mono text-[11px] uppercase tracking-widest" style={{ color: kindColor[selected.kind] }}>
                  {kindLabel[selected.kind]}
                </p>
                <p>
                  <strong className="text-white">{selected.label}.</strong> {selected.info}
                </p>
              </>
            ) : (
              <p className="text-slate-400">Select a node in the diagram, or use the buttons above, to see what it does.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
