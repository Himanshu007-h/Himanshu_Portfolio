import { useEffect, useState } from 'react'

export type PerfTier = 'high' | 'medium' | 'low'

export interface DeviceProfile {
  isMobile: boolean
  isTablet: boolean
  reducedMotion: boolean
  tier: PerfTier
  /** Max device pixel ratio the canvases should use */
  dpr: number
  /** Whether 3D should be rendered at all */
  enable3D: boolean
  /** Whether the ambient fish should render */
  enableFish: boolean
  particleScale: number
}

function compute(): DeviceProfile {
  if (typeof window === 'undefined') {
    return { isMobile: false, isTablet: false, reducedMotion: false, tier: 'high', dpr: 1.5, enable3D: true, enableFish: true, particleScale: 1 }
  }
  const w = window.innerWidth
  const isMobile = w < 768
  const isTablet = w >= 768 && w < 1100
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const cores = navigator.hardwareConcurrency || 4
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4
  const saveData = (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData === true

  let tier: PerfTier = 'high'
  if (isMobile || cores <= 4 || mem <= 2 || saveData) tier = 'low'
  else if (isTablet || cores <= 6 || mem <= 4) tier = 'medium'

  const dpr = tier === 'high' ? Math.min(window.devicePixelRatio || 1, 1.75) : tier === 'medium' ? 1.25 : 1
  return {
    isMobile,
    isTablet,
    reducedMotion,
    tier,
    dpr,
    enable3D: true,
    enableFish: !isMobile && !reducedMotion && tier !== 'low',
    particleScale: reducedMotion ? 0.15 : tier === 'high' ? 1 : tier === 'medium' ? 0.5 : 0.25,
  }
}

export function useDevice(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(compute)

  useEffect(() => {
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setProfile(compute()))
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    window.addEventListener('resize', update)
    mq.addEventListener('change', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', update)
      mq.removeEventListener('change', update)
    }
  }, [])

  return profile
}
