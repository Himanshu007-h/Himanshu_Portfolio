export type NodeKind =
  | 'system'
  | 'middleware'
  | 'api'
  | 'file'
  | 'security'
  | 'transform'
  | 'cloud'
  | 'network'

export interface ArchNode {
  id: string
  label: string
  kind: NodeKind
  /** Position in a normalised 2D layout space, x: -1..1, y: -1..1 */
  x: number
  y: number
  info: string
}

export interface ArchEdge {
  from: string
  to: string
  label?: string
}

export interface Architecture {
  id: string
  title: string
  subtitle: string
  nodes: ArchNode[]
  edges: ArchEdge[]
}

export interface Project {
  slug: string
  index: string
  title: string
  tagline: string
  summary: string
  tech: string[]
  architecture: Architecture
  /** Optional second flow (e.g. webhook return path) */
  secondary?: Architecture
  features?: string[]
  details: {
    problem: string
    flow: string[]
    security: string
    transformation: string
    errorHandling: string
    impact: string
  }
}

export interface SkillLayer {
  id: string
  order: number
  name: string
  blurb: string
  items: string[]
  color: string
}

export interface Incident {
  code: string
  title: string
  causes: string[]
  resolution: string
}

export interface Milestone {
  title: string
  detail: string
}
