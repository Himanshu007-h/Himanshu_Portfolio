import { motion, useReducedMotion } from 'framer-motion'
import { experience, milestones } from '../../data/experience'
import { Reveal, SectionHeading } from '../Reveal'

export function Experience() {
  const reduce = useReducedMotion()
  return (
    <section id="experience" className="section" aria-labelledby="exp-title">
      <SectionHeading eyebrow="Experience" title="Integration timeline" />
      <h2 id="exp-title" className="sr-only">
        Experience
      </h2>

      <Reveal className="mt-10">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="font-display text-xl font-semibold text-white">{experience.role}</p>
              <p className="text-slate-400">{experience.company}</p>
            </div>
            <p className="font-mono text-sm text-cyanx-300">{experience.period}</p>
          </div>

          <ol className="relative mt-8" aria-label="Milestones">
            <motion.span
              aria-hidden="true"
              className="absolute left-[11px] top-2 w-px origin-top bg-gradient-to-b from-cyanx-400 via-violetx-400 to-transparent"
              style={{ height: 'calc(100% - 1rem)' }}
              initial={reduce ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            />
            {milestones.map((m, i) => (
              <motion.li
                key={m.title}
                className="relative flex gap-5 py-3 pl-0"
                initial={reduce ? false : { opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <span className="relative mt-1 grid h-6 w-6 shrink-0 place-items-center" aria-hidden="true">
                  <span className="pulse-ring absolute h-3 w-3 rounded-full bg-cyanx-400/50" style={{ animationDelay: `${i * 0.3}s` }} />
                  <span className="relative h-3 w-3 rounded-full border-2 border-cyanx-300 bg-ink-950" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">{m.title}</h3>
                  <p className="text-sm text-slate-400">{m.detail}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  )
}
