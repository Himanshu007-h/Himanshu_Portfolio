import type { NodeKind } from '../types'

export const kindColor: Record<NodeKind, string> = {
  system: '#8b7dff',
  middleware: '#38d4f5',
  api: '#4ade80',
  file: '#ffc857',
  security: '#fb7185',
  transform: '#c084fc',
  cloud: '#2dd4bf',
  network: '#f59e0b',
}

export const kindLabel: Record<NodeKind, string> = {
  system: 'Business system',
  middleware: 'Middleware',
  api: 'API endpoint',
  file: 'File transfer',
  security: 'Security',
  transform: 'Transformation',
  cloud: 'Cloud service',
  network: 'Network',
}
