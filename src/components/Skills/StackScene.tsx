import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import type * as THREE from 'three'
import type { SkillLayer } from '../../types'
import { DataParticles } from '../../three/DataParticles'

interface Props {
  layers: SkillLayer[]
  selectedId: string
  hoverId: string | null
  /** Mutable rotation state shared with the DOM drag handlers. */
  angle: React.MutableRefObject<number>
  velocity: React.MutableRefObject<number>
  dragging: React.MutableRefObject<boolean>
  autoRotate: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

const GAP = 0.62

function Slab({
  layer,
  y,
  selected,
  hovered,
  onSelect,
  onHover,
}: {
  layer: SkillLayer
  y: number
  selected: boolean
  hovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}) {
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const k = 1 - Math.exp(-dt * 9)
    if (mat.current) {
      const e = selected ? 1 : hovered ? 0.75 : 0.3
      mat.current.emissiveIntensity += (e - mat.current.emissiveIntensity) * k
    }
    if (mesh.current) {
      const s = selected ? 1.07 : hovered ? 1.04 : 1
      mesh.current.scale.x += (s - mesh.current.scale.x) * k
      mesh.current.scale.z += (s - mesh.current.scale.z) * k
    }
  })

  return (
    <mesh
      ref={mesh}
      position={[0, y, 0]}
      onClick={(e) => {
        e.stopPropagation()
        if (e.delta < 6) onSelect(layer.id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(layer.id)
      }}
      onPointerOut={() => onHover(null)}
    >
      <boxGeometry args={[3.4, 0.28, 2.3]} />
      <meshStandardMaterial
        ref={mat}
        color={layer.color}
        emissive={layer.color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.62}
        metalness={0.25}
        roughness={0.45}
      />
      <Edges color={layer.color} />
    </mesh>
  )
}

export function StackScene({ layers, selectedId, hoverId, angle, velocity, dragging, autoRotate, onSelect, onHover }: Props) {
  const group = useRef<THREE.Group>(null)
  const mid = (layers.length - 1) / 2
  const top = (mid + 0.8) * GAP
  const bottom = -top

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    if (!dragging.current) {
      angle.current += velocity.current * dt
      velocity.current *= Math.exp(-dt * 2.2)
      if (autoRotate) angle.current += dt * 0.25
    }
    if (group.current) group.current.rotation.y = angle.current
  })

  return (
    <group ref={group} rotation={[0.28, 0, 0]}>
      {layers.map((l, i) => (
        <Slab
          key={l.id}
          layer={l}
          y={(i - mid) * GAP}
          selected={selectedId === l.id}
          hovered={hoverId === l.id}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
      {[[-1.55, -1], [1.55, -1], [-1.55, 1], [1.55, 1]].map(([x, zSign], i) => (
        <mesh key={i} position={[x, 0, zSign * 1.0]}>
          <cylinderGeometry args={[0.018, 0.018, top * 2, 6]} />
          <meshBasicMaterial color="#38d4f5" transparent opacity={0.35} />
        </mesh>
      ))}
      <DataParticles from={[0, bottom, 0]} to={[0, top, 0]} count={9} speed={0.2} size={0.07} color="#9ff0ff" active={autoRotate || true} />
    </group>
  )
}
