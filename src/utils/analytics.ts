/**
 * Optional, privacy-friendly analytics.
 *
 * Nothing loads unless you set an env variable (see README):
 *   VITE_ANALYTICS_PROVIDER=plausible  +  VITE_PLAUSIBLE_DOMAIN=yourdomain.com
 *   VITE_ANALYTICS_PROVIDER=ga         +  VITE_GA_ID=G-XXXXXXXXXX
 *
 * Respects the browser "Do Not Track" setting.
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return
  if (navigator.doNotTrack === '1') return

  const provider = import.meta.env.VITE_ANALYTICS_PROVIDER ?? 'none'

  if (provider === 'plausible' && import.meta.env.VITE_PLAUSIBLE_DOMAIN) {
    const s = document.createElement('script')
    s.defer = true
    s.dataset.domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN
    s.src = 'https://plausible.io/js/script.js'
    document.head.appendChild(s)
  }

  if (provider === 'ga' && import.meta.env.VITE_GA_ID) {
    const id = import.meta.env.VITE_GA_ID
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
    document.head.appendChild(s)
    const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void }
    w.dataLayer = w.dataLayer || []
    w.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer.push(arguments)
    }
    w.gtag('js', new Date())
    w.gtag('config', id, { anonymize_ip: true })
  }
}
