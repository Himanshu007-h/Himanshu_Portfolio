import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type V3 = [number, number, number]

interface Props {
  from: V3
  to: V3
  count?: number
  speed?: number
  color?: string
  size?: number
  active?: boolean
  /** Lifts the packet path out of the plane for a curved feel */
  arc?: number
  offset?: number
}

const dummy = new THREE.Object3D()

/**
 * Data packets travelling between two points. One InstancedMesh per stream,
 * so even many streams stay cheap. Hidden (and skipped) when inactive.
 */
export function DataParticles({
  from,
  to,
  count = 6,
  speed = 0.35,
  color = '#7fe7ff',
  size = 0.055,
  active = true,
  arc = 0,
  offset = 0,
}: Props) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const a = useMemo(() => new THREE.Vector3(from[0], from[1], from[2]), [from[0], from[1], from[2]])
  const b = useMemo(() => new THREE.Vector3(to[0], to[1], to[2]), [to[0], to[1], to[2]])

  useFrame(({ clock }) => {
    const m = mesh.current
    if (!m) return
    m.visible = active
    if (!active) return
    const t0 = clock.elapsedTime * speed + offset
    for (let i = 0; i < count; i++) {
      const t = (t0 + i / count) % 1
      dummy.position.lerpVectors(a, b, t)
      dummy.position.z += Math.sin(Math.PI * t) * arc
      dummy.scale.setScalar(size * (0.45 + Math.sin(Math.PI * t)))
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.95} depthWrite={false} />
    </instancedMesh>
  )
}
