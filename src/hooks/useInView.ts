import { useEffect, useRef, useState } from 'react'

/** True while the element is within (or near) the viewport. Used to pause offscreen 3D. */
export function useInView<T extends Element>(rootMargin = '200px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return { ref, inView }
}
