import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useDevice } from '../hooks/useDevice'

/** Builds the low-poly fish geometry once and disposes it on unmount. */
function useFishGeometry() {
  const geo = useMemo(() => {
    const profile = [
      [0, -1], [0.14, -0.82], [0.3, -0.5], [0.43, -0.1], [0.44, 0.22], [0.34, 0.6], [0.16, 0.88], [0, 1],
    ].map(([r, y]) => new THREE.Vector2(r, y))
    const body = new THREE.LatheGeometry(profile, 8)
    body.rotateZ(-Math.PI / 2) // nose points +X
    body.scale(1.5, 1, 0.55)

    const tail = new THREE.ConeGeometry(0.5, 0.9, 4)
    tail.rotateZ(-Math.PI / 2) // tip towards +X (the body)
    tail.translate(-0.45, 0, 0) // tip sits at the pivot
    tail.scale(1, 1.15, 0.12)

    const dorsal = new THREE.ConeGeometry(0.22, 0.6, 3)
    dorsal.rotateZ(0.55)
    dorsal.scale(1, 1, 0.14)

    const pectoral = new THREE.ConeGeometry(0.13, 0.45, 3)
    pectoral.rotateZ(Math.PI / 2)
    pectoral.scale(1, 1, 0.2)

    const eye = new THREE.SphereGeometry(0.055, 6, 6)
    return { body, tail, dorsal, pectoral, eye }
  }, [])

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose())
    },
    [geo],
  )
  return geo
}

function Fish() {
  const root = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Group>(null)
  const tailRef = useRef<THREE.Group>(null)
  const finL = useRef<THREE.Mesh>(null)
  const finR = useRef<THREE.Mesh>(null)
  const geo = useFishGeometry()
  const { viewport } = useThree()

  const st = useRef({
    target: new THREE.Vector3(),
    vel: new THREE.Vector3(0.35, 0, 0),
    nextChange: 0,
    yaw: 0,
    pitch: 0,
    ready: false,
  })
  const tmp = useMemo(() => new THREE.Vector3(), [])

  const pickTarget = (fromX: number) => {
    const xb = viewport.width * 0.55
    const yb = viewport.height * 0.38
    const side = fromX > 0 ? -1 : 1 // usually swim across to the other side
    const x = Math.random() < 0.8 ? side * xb * (0.5 + Math.random() * 0.5) : (Math.random() * 2 - 1) * xb
    st.current.target.set(x, (Math.random() * 2 - 1) * yb, -2 - Math.random() * 3.2)
  }

  useFrame(({ clock }, dtRaw) => {
    const g = root.current
    if (!g) return
    const dt = Math.min(dtRaw, 0.05)
    const t = clock.elapsedTime
    const s = st.current

    if (!s.ready) {
      g.position.set(-viewport.width * 0.6, viewport.height * 0.1, -3)
      pickTarget(g.position.x)
      s.ready = true
    }
    if (t > s.nextChange) {
      pickTarget(g.position.x)
      s.nextChange = t + 8 + Math.random() * 8
    }

    tmp.copy(s.target).sub(g.position)
    const dist = tmp.length()
    if (dist < 0.8) s.nextChange = 0
    tmp.normalize().multiplyScalar(0.55)
    s.vel.lerp(tmp, 1 - Math.exp(-dt * 0.7))
    g.position.addScaledVector(s.vel, dt)

    const yawTarget = s.vel.x < 0 ? Math.PI : 0
    const pitchTarget = THREE.MathUtils.clamp(Math.atan2(s.vel.y, Math.abs(s.vel.x) + 0.05), -0.5, 0.5)
    s.yaw += (yawTarget - s.yaw) * (1 - Math.exp(-dt * 1.6))
    s.pitch += (pitchTarget - s.pitch) * (1 - Math.exp(-dt * 2))
    g.rotation.set(0, s.yaw, s.pitch)

    const rate = 5 + s.vel.length() * 4
    if (tailRef.current) tailRef.current.rotation.y = Math.sin(t * rate) * 0.55
    if (bodyRef.current) bodyRef.current.rotation.y = Math.sin(t * rate - 0.9) * 0.09
    const flap = Math.sin(t * rate * 0.5) * 0.25
    if (finL.current) finL.current.rotation.x = 0.8 + flap
    if (finR.current) finR.current.rotation.x = -0.8 - flap
    g.position.y += Math.sin(t * 0.9) * 0.0025
  })

  return (
    <group ref={root} scale={0.55}>
      <group ref={bodyRef}>
        <mesh geometry={geo.body}>
          <meshStandardMaterial color="#2aa3c8" emissive="#0b4a63" emissiveIntensity={0.6} flatShading transparent opacity={0.4} roughness={0.55} />
        </mesh>
        <mesh geometry={geo.dorsal} position={[-0.05, 0.4, 0]}>
          <meshStandardMaterial color="#38d4f5" flatShading transparent opacity={0.34} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={finL} geometry={geo.pectoral} position={[0.45, -0.12, 0.2]}>
          <meshStandardMaterial color="#38d4f5" flatShading transparent opacity={0.34} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={finR} geometry={geo.pectoral} position={[0.45, -0.12, -0.2]}>
          <meshStandardMaterial color="#38d4f5" flatShading transparent opacity={0.34} side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={geo.eye} position={[1.05, 0.14, 0.2]}>
          <meshBasicMaterial color="#d3f8ff" transparent opacity={0.6} />
        </mesh>
        <mesh geometry={geo.eye} position={[1.05, 0.14, -0.2]}>
          <meshBasicMaterial color="#d3f8ff" transparent opacity={0.6} />
        </mesh>
        <group ref={tailRef} position={[-1.45, 0, 0]}>
          <mesh geometry={geo.tail}>
            <meshStandardMaterial color="#5ee1ff" flatShading transparent opacity={0.34} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/** Slow drifting motes: the "digital ecosystem" the fish swims through. */
function Motes({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const { viewport } = useThree()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14
      arr[i * 3 + 2] = -1 - Math.random() * 7
    }
    return arr
  }, [count])

  useFrame((_, dtRaw) => {
    const p = ref.current
    if (!p) return
    const dt = Math.min(dtRaw, 0.05)
    const attr = p.geometry.getAttribute('position') as THREE.BufferAttribute
    const top = viewport.height * 0.75
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) + dt * 0.12
      if (y > top) y = -top
      attr.setY(i, y)
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#7fe7ff" size={0.045} transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  )
}

/**
 * Ambient background: one subdued stylised fish and a few drifting motes.
 * Renders nothing on mobile, on low-end devices, or with prefers-reduced-motion.
 */
export default function FishScene() {
  const device = useDevice()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onVis = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  if (!device.enableFish) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={Math.min(device.dpr, 1.25)}
        frameloop={hidden ? 'never' : 'always'}
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: device.tier === 'high', alpha: true, powerPreference: 'low-power' }}
        style={{ pointerEvents: 'none' }}
      >
        <fog attach="fog" args={['#05070d', 7, 16]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 5]} intensity={1.1} color="#bfefff" />
        <pointLight position={[-4, -2, 2]} intensity={0.6} color="#7c6cff" />
        <Fish />
        <Motes count={device.tier === 'high' ? 70 : 35} />
      </Canvas>
    </div>
  )
}
