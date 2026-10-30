import { useEffect, useState } from 'react'

export function useCountUp(target: number, active: boolean, duration = 1400, disabled = false) {
  const [value, setValue] = useState(disabled ? target : 0)

  useEffect(() => {
    if (disabled) {
      setValue(target)
      return
    }
    if (!active) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration, disabled])

  return value
}
