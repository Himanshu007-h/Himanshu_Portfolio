import type { Architecture } from '../../types'
import { kindColor } from '../../utils/colors'

interface Props {
  architecture: Architecture
  selectedId?: string | null
  onSelect?: (id: string) => void
  /** Animate packets along the edges */
  flow?: boolean
  className?: string
}

const px = (x: number) => 50 + x * 42
const py = (y: number) => 50 + y * 36

/**
 * Lightweight SVG rendering of an architecture. Used as the WebGL fallback and
 * as the cheap in-card preview. Pure SVG, so it stays crisp and keyboard friendly.
 */
export function StaticArchitecture({ architecture, selectedId, onSelect, flow = false, className = '' }: Props) {
  const byId = new Map(architecture.nodes.map((n) => [n.id, n]))
  return (
    <svg
      viewBox="0 0 100 56"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={`Architecture: ${architecture.title}`}
    >
      {architecture.edges.map((e, i) => {
        const a = byId.get(e.from)
        const b = byId.get(e.to)
        if (!a || !b) return null
        const x1 = px(a.x)
        const y1 = py(a.y) * 0.56
        const x2 = px(b.x)
        const y2 = py(b.y) * 0.56
        const color = kindColor[a.kind]
        return (
          <g key={`${e.from}-${e.to}`}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={flow ? color : '#2c3d5c'} strokeWidth={0.5} strokeOpacity={flow ? 0.9 : 0.8} />
            {flow && (
              <circle r={1.1} fill={color}>
                <animateMotion dur="2.2s" begin={`${i * 0.3}s`} repeatCount="indefinite" path={`M${x1} ${y1} L${x2} ${y2}`} />
              </circle>
            )}
          </g>
        )
      })}
      {architecture.nodes.map((n) => {
        const x = px(n.x)
        const y = py(n.y) * 0.56
        const color = kindColor[n.kind]
        const sel = selectedId === n.id
        return (
          <g
            key={n.id}
            transform={`translate(${x} ${y})`}
            onClick={onSelect ? () => onSelect(n.id) : undefined}
            style={{ cursor: onSelect ? 'pointer' : undefined }}
          >
            <rect x={-3.2} y={-3.2} width={6.4} height={6.4} rx={1.4} fill={color} fillOpacity={sel ? 0.5 : 0.22} stroke={color} strokeWidth={sel ? 0.7 : 0.4} />
            <text y={7.4} textAnchor="middle" fontSize={2.6} fill="#cbd5e1" fontFamily="JetBrains Mono, monospace">
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
