/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANALYTICS_PROVIDER?: 'plausible' | 'ga' | 'none'
  readonly VITE_PLAUSIBLE_DOMAIN?: string
  readonly VITE_GA_ID?: string
}
