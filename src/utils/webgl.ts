let cached: boolean | null = null

/** One-time WebGL capability check so 3D can degrade gracefully instead of crashing. */
export function hasWebGL(): boolean {
  if (cached !== null) return cached
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null
    cached = !!gl
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    cached = false
  }
  return cached
}
