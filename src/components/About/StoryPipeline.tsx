import { motion, useReducedMotion } from 'framer-motion'

const stages = [
  { name: 'Systems', note: 'S/4HANA, PI/PO, third-party platforms' },
  { name: 'Connectivity', note: 'Adapters, Cloud Connector, private APIs' },
  { name: 'Integration', note: 'iFlows, routing, orchestration' },
  { name: 'Transformation', note: 'Mapping, XSLT, Groovy' },
  { name: 'Security', note: 'PGP, certificates, OAuth, TLS' },
  { name: 'Monitoring', note: 'Operations Cockpit, troubleshooting' },
  { name: 'Business outcome', note: 'Reliable, zero-downtime delivery' },
]

/** Profile visualisation: the path a message travels, which is also how I approach every integration. */
export function StoryPipeline() {
  const reduce = useReducedMotion()
  return (
    <ol className="relative space-y-1 border-l border-white/10 pl-6" aria-label="How I approach an integration">
      {stages.map((s, i) => (
        <motion.li
          key={s.name}
          className="relative py-2.5"
          initial={reduce ? false : { opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: i * 0.08, duration: 0.45 }}
        >
          <span
            className="absolute -left-[29px] top-[18px] grid h-3 w-3 place-items-center rounded-full border border-cyanx-400 bg-ink-950"
            aria-hidden="true"
          >
            <span className="h-1 w-1 rounded-full bg-cyanx-300" />
          </span>
          <p className="font-display text-sm font-semibold text-white">
            <span className="mr-2 font-mono text-[11px] text-slate-500">{String(i + 1).padStart(2, '0')}</span>
            {s.name}
          </p>
          <p className="text-xs text-slate-400">{s.note}</p>
        </motion.li>
      ))}
    </ol>
  )
}
