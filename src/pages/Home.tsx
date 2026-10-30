import { Hero } from '../components/Hero/Hero'
import { About } from '../components/About/About'
import { Metrics } from '../components/Metrics/Metrics'
import { Projects } from '../components/ProjectCard3D/Projects'
import { ArchitectureLab } from '../components/ArchitectureLab/ArchitectureLab'
import { Skills } from '../components/Skills/Skills'
import { Experience } from '../components/Experience/Experience'
import { Troubleshooting } from '../components/Troubleshooting/Troubleshooting'
import { Contact, Resume } from '../components/Contact/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Metrics />
      <Projects />
      <ArchitectureLab />
      <Skills />
      <Experience />
      <Troubleshooting />
      <Resume />
      <Contact />
    </>
  )
}
