import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Edges, Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import type { ArchNode, Architecture } from '../../types'
import { kindColor } from '../../utils/colors'
import { NodeShape } from '../../three/IntegrationNodes'
import { DataParticles } from '../../three/DataParticles'

type V3 = [number, number, number]

interface SceneProps {
  arch: Architecture
  vertical: boolean
  flow: boolean
  selectedId: string | null
  hoverId: string | null
  animate: boolean
  tilt: boolean
  particles: number
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

const UP = new THREE.Vector3(0, 1, 0)

function Arrow({ from, to, color }: { from: V3; to: V3; color: string }) {
  const { pos, quat } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const dir = b.clone().sub(a).normalize()
    const p = a.clone().lerp(b, 0.78)
    return { pos: p.toArray() as V3, quat: new THREE.Quaternion().setFromUnitVectors(UP, dir) }
  }, [from, to])
  return (
    <mesh position={pos} quaternion={quat}>
      <coneGeometry args={[0.07, 0.2, 6]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

interface NodeMeshProps {
  node: ArchNode
  position: V3
  selected: boolean
  hovered: boolean
  animate: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

function NodeMesh({ node, position, selected, hovered, animate, onSelect, onHover }: NodeMeshProps) {
  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  const ring = useRef<THREE.Mesh>(null)
  const color = kindColor[node.kind]
  const phase = useMemo(() => position[0] * 2.1 + position[1], [position])

  useEffect(() => () => void (document.body.style.cursor = ''), [])

  useFrame(({ clock }, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const g = group.current
    if (!g) return
    const target = hovered ? 1.2 : selected ? 1.12 : 1
    g.scale.setScalar(g.scale.x + (target - g.scale.x) * (1 - Math.exp(-dt * 10)))
    if (animate) g.position.y = position[1] + Math.sin(clock.elapsedTime * 0.9 + phase) * 0.05
    if (mat.current) {
      const e = hovered || selected ? 0.95 : 0.4
      mat.current.emissiveIntensity += (e - mat.current.emissiveIntensity) * (1 - Math.exp(-dt * 8))
    }
    if (ring.current && animate) ring.current.rotation.z += dt * 0.8
  })

  return (
    <group ref={group} position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onSelect(node.id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
          onHover(node.id)
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
          onHover(null)
        }}
      >
        <NodeShape kind={node.kind} />
        <meshStandardMaterial
          ref={mat}
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          flatShading
          transparent
          opacity={0.9}
          metalness={0.3}
          roughness={0.4}
        />
        <Edges threshold={20} color={color} />
      </mesh>
      {selected && (
        <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[0.72, 0.015, 8, 48]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      )}
      <Html position={[0, -0.75, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
        <span
          className={`whitespace-nowrap rounded-md border px-1.5 py-0.5 font-mono text-[10px] tracking-wide backdrop-blur-sm sm:text-[11px] ${
            selected || hovered
              ? 'border-cyanx-400/60 bg-ink-900/90 text-white'
              : 'border-white/10 bg-ink-900/70 text-slate-300'
          }`}
        >
          {node.label}
        </span>
      </Html>
    </group>
  )
}

export function ArchScene({
  arch,
  vertical,
  flow,
  selectedId,
  hoverId,
  animate,
  tilt,
  particles,
  onSelect,
  onHover,
}: SceneProps) {
  const { viewport } = useThree()
  const group = useRef<THREE.Group>(null)

  const positions = useMemo(() => {
    const wx = (viewport.width / 2) * (vertical ? 0.62 : 0.8)
    const hy = (viewport.height / 2) * (vertical ? 0.74 : 0.52)
    const map = new Map<string, V3>()
    for (const n of arch.nodes) {
      map.set(n.id, vertical ? [n.y * wx * 1.5, -n.x * hy, 0] : [n.x * wx, -n.y * hy * 1.4, 0])
    }
    return map
  }, [arch, vertical, viewport.width, viewport.height])

  useFrame((state, dtRaw) => {
    const g = group.current
    if (!g || !tilt) return
    const dt = Math.min(dtRaw, 0.05)
    const k = 1 - Math.exp(-dt * 4)
    g.rotation.y += (state.pointer.x * 0.28 - g.rotation.y) * k
    g.rotation.x += (-0.12 - state.pointer.y * 0.18 - g.rotation.x) * k
  })

  return (
    <group ref={group} rotation={[-0.12, 0, 0]}>
      {arch.edges.map((e, i) => {
        const a = positions.get(e.from)
        const b = positions.get(e.to)
        if (!a || !b) return null
        const src = arch.nodes.find((n) => n.id === e.from)!
        const hot = flow || hoverId === e.from || hoverId === e.to || selectedId === e.from || selectedId === e.to
        const color = kindColor[src.kind]
        return (
          <group key={`${arch.id}-${e.from}-${e.to}`}>
            <Line points={[a, b]} color={hot ? color : '#2c3d5c'} lineWidth={hot ? 2 : 1.2} transparent opacity={hot ? 0.9 : 0.55} />
            <Arrow from={a} to={b} color={hot ? color : '#3a4f75'} />
            <DataParticles
              from={a}
              to={b}
              count={particles}
              speed={0.32}
              offset={i * 0.21}
              color={color}
              size={0.065}
              active={hot}
            />
          </group>
        )
      })}
      {arch.nodes.map((n) => {
        const p = positions.get(n.id)
        if (!p) return null
        return (
          <NodeMesh
            key={`${arch.id}-${n.id}`}
            node={n}
            position={p}
            selected={selectedId === n.id}
            hovered={hoverId === n.id}
            animate={animate}
            onSelect={onSelect}
            onHover={onHover}
          />
        )
      })}
    </group>
  )
}
