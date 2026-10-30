import { Component, type ReactNode } from 'react'

interface Props {
  fallback?: ReactNode
  children: ReactNode
}

/** Catches WebGL / Three.js failures so the page content always stays usable. */
export class Canvas3DBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) console.warn('[3D] scene failed, using fallback', error)
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}
