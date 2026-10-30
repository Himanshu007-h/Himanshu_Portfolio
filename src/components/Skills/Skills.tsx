import { Reveal, SectionHeading } from '../Reveal'
import { IntegrationStack } from './IntegrationStack'

export function Skills() {
  return (
    <section id="stack" className="section" aria-labelledby="stack-title">
      <SectionHeading
        eyebrow="Technical stack"
        title="The Integration Stack"
        lead="Seven layers, from the SAP systems at the bottom to monitoring at the top. Rotate the stack and pick a layer."
      />
      <h2 id="stack-title" className="sr-only">
        Integration stack
      </h2>
      <Reveal className="mt-10">
        <IntegrationStack />
      </Reveal>
    </section>
  )
}
