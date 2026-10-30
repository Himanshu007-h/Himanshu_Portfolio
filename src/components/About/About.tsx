import { Cable, Rocket, ShieldCheck, Wrench, Workflow, Network } from 'lucide-react'
import { Reveal, SectionHeading } from '../Reveal'
import { StoryPipeline } from './StoryPipeline'

const pillars = [
  { icon: Workflow, title: 'Enterprise integration', text: 'End-to-end iFlows between S/4HANA, cloud platforms and external systems.' },
  { icon: Rocket, title: 'Migration', text: 'PI/PO scenarios rebuilt on SAP BTP CPI and cut over without downtime.' },
  { icon: Wrench, title: 'Production support', text: 'Hands-on troubleshooting of live interfaces through CPI Operations Cockpit.' },
  { icon: ShieldCheck, title: 'Security', text: 'PGP, certificates, OAuth / Basic auth and TLS issues diagnosed and fixed.' },
  { icon: Cable, title: 'API integrations', text: 'REST, OData V2/V4, SOAP, IDoc, SFTP and JDBC connectivity.' },
  { icon: Network, title: 'Scalable design', text: 'Reusable patterns, error handling frameworks and API Management in front of backends.' },
]

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Reveal>
            <p className="eyebrow">About</p>
            <h2 id="about-title" className="section-title">
              Integration Engineer. Problem Solver. Production-Focused.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-2xl leading-relaxed text-slate-300">
              I design, build and support enterprise integrations on SAP BTP. Over two years of hands-on work I have implemented
              125+ SAP CPI interfaces and migrated 20+ SAP PI/PO scenarios to Cloud Integration across automotive, financial
              services, logistics and manufacturing clients.
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">
              My focus is on integrations that keep working after go-live: clear error handling, secure connectivity, and the
              ability to trace a failing message back to the cause, whether that is a certificate chain, an authorization gap or
              a firewall in the path.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="glass h-full rounded-2xl p-5">
                  <p.icon size={20} className="text-cyanx-400" aria-hidden="true" />
                  <h3 className="mt-3 font-display text-base font-semibold text-white">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="glass rounded-3xl p-6 lg:sticky lg:top-24">
            <p className="eyebrow">How a message travels</p>
            <h3 className="mt-2 mb-4 font-display text-lg font-semibold text-white">The story behind every interface</h3>
            <StoryPipeline />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
