import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'

interface Props {
  /** Slow continuous rotation. Disabled for reduced motion. */
  rotate?: boolean
  scale?: number
}

/** The central "Integration Core": layered low-poly solid, wireframe shell, bright nucleus and two orbit rings. */
export function IntegrationCore({ rotate = true, scale = 1 }: Props) {
  const group = useRef<THREE.Group>(null)
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const shell = useRef<THREE.Mesh>(null)

  useFrame((_, dtRaw) => {
    if (!rotate) return
    const dt = Math.min(dtRaw, 0.05)
    if (group.current) {
      group.current.rotation.y += dt * 0.22
      group.current.rotation.x += dt * 0.04
    }
    if (shell.current) shell.current.rotation.y -= dt * 0.35
    if (ringA.current) ringA.current.rotation.z += dt * 0.45
    if (ringB.current) ringB.current.rotation.z -= dt * 0.3
  })

  return (
    <group ref={group} scale={scale}>
      <mesh>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial
          color="#0b2a3d"
          emissive="#12b5da"
          emissiveIntensity={0.5}
          flatShading
          metalness={0.6}
          roughness={0.35}
        />
      </mesh>
      <mesh ref={shell} scale={1.4}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color="#38d4f5" wireframe transparent opacity={0.32} />
      </mesh>
      <mesh scale={0.5}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#d3f8ff" toneMapped={false} />
      </mesh>
      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.95, 0.012, 8, 96]} />
        <meshBasicMaterial color="#7fe7ff" transparent opacity={0.7} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2.4, 0.9, 0]}>
        <torusGeometry args={[2.35, 0.01, 8, 96]} />
        <meshBasicMaterial color="#9b8cff" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}
