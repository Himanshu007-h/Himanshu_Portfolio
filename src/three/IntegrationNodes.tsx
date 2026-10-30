import { memo, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Edges, Html, Line } from '@react-three/drei'
import type * as THREE from 'three'
import type { NodeKind } from '../types'
import { kindColor } from '../utils/colors'
import { DataParticles } from './DataParticles'

type V3 = [number, number, number]

export const HERO_NODES: { label: string; kind: NodeKind }[] = [
  { label: 'SAP S/4HANA', kind: 'system' },
  { label: 'SAP CPI', kind: 'middleware' },
  { label: 'API', kind: 'api' },
  { label: 'SFTP', kind: 'file' },
  { label: 'OData', kind: 'transform' },
  { label: 'IDoc', kind: 'system' },
  { label: 'Cloud Connector', kind: 'network' },
  { label: 'API Management', kind: 'cloud' },
]

export function NodeShape({ kind }: { kind: NodeKind }) {
  switch (kind) {
    case 'system':
      return <boxGeometry args={[0.8, 0.8, 0.8]} />
    case 'middleware':
      return <octahedronGeometry args={[0.6, 0]} />
    case 'api':
      return <icosahedronGeometry args={[0.5, 0]} />
    case 'file':
      return <cylinderGeometry args={[0.42, 0.42, 0.7, 6]} />
    case 'security':
      return <dodecahedronGeometry args={[0.5, 0]} />
    case 'transform':
      return <coneGeometry args={[0.5, 0.85, 4]} />
    case 'cloud':
      return <icosahedronGeometry args={[0.55, 1]} />
    case 'network':
      return <torusGeometry args={[0.38, 0.16, 8, 14]} />
  }
}

interface FloatingNodeProps {
  label: string
  kind: NodeKind
  position: V3
  phase: number
  animate: boolean
  showLabel: boolean
}

const FloatingNode = memo(function FloatingNode({ label, kind, position, phase, animate, showLabel }: FloatingNodeProps) {
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const color = kindColor[kind]
  const gl = useThree((st) => st.gl)
  // Mount labels in the canvas wrapper (not the eventSource element) so they stay aligned with the nodes.
  const portal = useMemo(() => ({ current: gl.domElement.parentElement as HTMLElement }), [gl])

  useFrame(({ clock }, dtRaw) => {
    if (!animate) return
    const dt = Math.min(dtRaw, 0.05)
    const t = clock.elapsedTime
    if (group.current) group.current.position.y = position[1] + Math.sin(t * 0.8 + phase) * 0.16
    if (mesh.current) {
      mesh.current.rotation.y += dt * 0.4
      mesh.current.rotation.x += dt * 0.15
    }
  })

  return (
    <group ref={group} position={position}>
      <mesh ref={mesh}>
        <NodeShape kind={kind} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          flatShading
          transparent
          opacity={0.82}
          metalness={0.3}
          roughness={0.4}
        />
        <Edges threshold={20} color={color} />
      </mesh>
      {showLabel && (
        <Html portal={portal} position={[0, -0.85, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <span className="whitespace-nowrap rounded-md border border-white/10 bg-ink-900/70 px-2 py-0.5 font-mono text-[11px] tracking-wide text-slate-200 backdrop-blur-sm">
            {label}
          </span>
        </Html>
      )}
    </group>
  )
})

interface Props {
  animate: boolean
  /** Fewer nodes + no labels on small screens */
  compact: boolean
  particleScale: number
}

/** Ring of labelled integration nodes connected to the core by animated data streams. */
export function IntegrationNodes({ animate, compact, particleScale }: Props) {
  const { viewport } = useThree()
  const scale = Math.min(1, viewport.width / 11)

  const placed = useMemo(() => {
    const list = compact ? HERO_NODES.filter((_, i) => i % 2 === 0) : HERO_NODES
    return list.map((n, i) => {
      const angle = (i / list.length) * Math.PI * 2 + 0.3
      const pos: V3 = [Math.cos(angle) * 3.5, Math.sin(angle) * 2.5, Math.sin(i * 1.7) * 1.3]
      return { ...n, pos, phase: i * 0.9 }
    })
  }, [compact])

  const perStream = Math.max(2, Math.round(4 * particleScale))

  return (
    <group scale={scale} position={[viewport.width > 9 ? 0.7 : 0, 0, 0]}>
      {placed.map((n, i) => (
        <group key={n.label}>
          <FloatingNode
            label={n.label}
            kind={n.kind}
            position={n.pos}
            phase={n.phase}
            animate={animate}
            showLabel={!compact}
          />
          <Line points={[n.pos, [0, 0, 0]]} color={kindColor[n.kind]} lineWidth={1} transparent opacity={0.22} />
          <DataParticles
            from={i % 2 === 0 ? n.pos : [0, 0, 0]}
            to={i % 2 === 0 ? [0, 0, 0] : n.pos}
            count={perStream}
            speed={animate ? 0.28 : 0}
            offset={i * 0.13}
            color={kindColor[n.kind]}
            size={0.06}
          />
        </group>
      ))}
    </group>
  )
}
