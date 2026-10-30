import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { IntegrationCore } from '../IntegrationCore/IntegrationCore'
import { IntegrationNodes } from '../../three/IntegrationNodes'
import type { DeviceProfile } from '../../hooks/useDevice'

function Rig({ children, parallax }: { children: React.ReactNode; parallax: boolean }) {
  const g = useRef<THREE.Group>(null)
  useFrame((state, dtRaw) => {
    if (!g.current || !parallax) return
    const k = 1 - Math.exp(-Math.min(dtRaw, 0.05) * 3)
    g.current.rotation.y += (state.pointer.x * 0.3 - g.current.rotation.y) * k
    g.current.rotation.x += (-state.pointer.y * 0.18 - g.current.rotation.x) * k
  })
  return <group ref={g}>{children}</group>
}

interface Props {
  device: DeviceProfile
  active: boolean
  eventSource: React.RefObject<HTMLElement>
}

export default function HeroScene({ device, active, eventSource }: Props) {
  const animate = !device.reducedMotion
  const compact = device.isMobile
  return (
    <Canvas
      dpr={device.dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 10.5], fov: 45 }}
      gl={{ antialias: device.tier !== 'low', alpha: true, powerPreference: 'high-performance' }}
      eventSource={eventSource as React.MutableRefObject<HTMLElement>}
      eventPrefix="client"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 6]} intensity={1.3} color="#cdf4ff" />
      <pointLight position={[0, 0, 0]} intensity={2.2} color="#38d4f5" distance={9} />
      <pointLight position={[-6, -3, 3]} intensity={0.8} color="#7c6cff" />
      <Rig parallax={animate && !compact}>
        <IntegrationCore rotate={animate} scale={compact ? 0.85 : 1} />
        <IntegrationNodes animate={animate} compact={compact} particleScale={device.particleScale} />
      </Rig>
    </Canvas>
  )
}
