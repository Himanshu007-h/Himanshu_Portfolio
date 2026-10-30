import { projects } from '../../data/projects'
import { Reveal, SectionHeading } from '../Reveal'
import { ProjectCard3D } from './ProjectCard3D'

/** Projects whose architecture is shown as a live, interactive 3D scene right in the card. */
const FEATURED = new Set(['bank-payment-neft-rtgs', 'logistics-shipping', 'whatsapp-invoice'])

export function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <SectionHeading
        eyebrow="Selected work"
        title="Projects as integration architectures"
        lead="Each project is shown as the integration it actually is. Hover a card to light up the data flow, click through for the full breakdown."
      />
      <h2 id="projects-title" className="sr-only">
        Projects
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.06} className="h-full">
            <ProjectCard3D project={p} featured={FEATURED.has(p.slug)} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
