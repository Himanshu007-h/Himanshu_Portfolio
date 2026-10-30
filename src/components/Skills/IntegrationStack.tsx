import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { skillLayers, programming } from '../../data/skills'
import { useDevice } from '../../hooks/useDevice'
import { useInView } from '../../hooks/useInView'
import { hasWebGL } from '../../utils/webgl'
import { Canvas3DBoundary } from '../Canvas3DBoundary'
import { StackScene } from './StackScene'

export function IntegrationStack() {
  const device = useDevice()
  const { ref, inView } = useInView<HTMLDivElement>('300px')
  const [seen, setSeen] = useState(false)
  const [selectedId, setSelectedId] = useState('integration')
  const [hoverId, setHoverId] = useState<string | null>(null)
  const angle = useRef(0.5)
  const velocity = useRef(0)
  const dragging = useRef(false)
  const lastX = useRef(0)
  const webgl = useMemo(() => hasWebGL(), [])

  useEffect(() => {
    if (inView) setSeen(true)
  }, [inView])

  const selected = skillLayers.find((l) => l.id === selectedId) ?? skillLayers[0]
  const ordered = [...skillLayers].sort((a, b) => b.order - a.order) // top layer first in the list

  const nudge = (dir: number) => {
    velocity.current += dir * 2.2
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <div
          ref={ref}
          tabIndex={0}
          role="group"
          aria-label="Interactive 3D integration stack. Drag, or use the left and right arrow keys, to rotate."
          className="relative h-[420px] cursor-grab overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60 active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
          onPointerDown={(e) => {
            dragging.current = true
            lastX.current = e.clientX
            velocity.current = 0
            e.currentTarget.setPointerCapture(e.pointerId)
          }}
          onPointerMove={(e) => {
            if (!dragging.current) return
            const dx = e.clientX - lastX.current
            lastX.current = e.clientX
            angle.current += dx * 0.01
            velocity.current = dx * 0.4
          }}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') nudge(-1)
            if (e.key === 'ArrowRight') nudge(1)
          }}
        >
          {webgl && seen ? (
            <Canvas3DBoundary>
              <Canvas
                dpr={device.dpr}
                frameloop={inView ? 'always' : 'never'}
                camera={{ position: [0, 0.4, 8.2], fov: 38 }}
                gl={{ antialias: device.tier !== 'low', alpha: true }}
              >
                <ambientLight intensity={0.85} />
                <directionalLight position={[4, 5, 5]} intensity={1.2} />
                <pointLight position={[-4, -2, 3]} intensity={0.6} color="#7c6cff" />
                <StackScene
                  layers={skillLayers}
                  selectedId={selectedId}
                  hoverId={hoverId}
                  angle={angle}
                  velocity={velocity}
                  dragging={dragging}
                  autoRotate={!device.reducedMotion}
                  onSelect={setSelectedId}
                  onHover={setHoverId}
                />
              </Canvas>
            </Canvas3DBoundary>
          ) : null}
          <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[11px] uppercase tracking-widest text-slate-500">
            Drag to rotate
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button type="button" className="btn-icon" aria-label="Rotate stack left" onClick={() => nudge(-1)}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" className="btn-icon" aria-label="Rotate stack right" onClick={() => nudge(1)}>
            <ChevronRight size={18} />
          </button>
          <p className="ml-2 text-xs text-slate-500">Layer 7 (top) to layer 1 (bottom) mirrors how a request travels back down to the systems.</p>
        </div>
      </div>

      <div>
        <ul className="space-y-2" aria-label="Integration stack layers">
          {ordered.map((l) => {
            const active = l.id === selectedId
            return (
              <li key={l.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedId(l.id)}
                  onMouseEnter={() => setHoverId(l.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onFocus={() => setHoverId(l.id)}
                  onBlur={() => setHoverId(null)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-colors ${
                    active ? 'border-white/30 bg-white/[0.07]' : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                  }`}
                >
                  <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: l.color }} aria-hidden="true" />
                  <span className="font-mono text-xs text-slate-500">L{l.order}</span>
                  <span className="font-display text-sm font-semibold text-white">{l.name}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="glass mt-4 rounded-2xl p-5" aria-live="polite">
          <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: selected.color }}>
            Layer {selected.order} · {selected.name}
          </p>
          <p className="mt-1 text-sm text-slate-300">{selected.blurb}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {selected.items.map((it) => (
              <li key={it} className="chip">
                {it}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          <span className="text-slate-400">Programming:</span> {programming.join(' · ')}
        </p>
      </div>
    </div>
  )
}
