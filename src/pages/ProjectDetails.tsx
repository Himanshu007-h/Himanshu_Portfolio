import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, AlertTriangle, BadgeCheck, Lock, Repeat, Target, Workflow } from 'lucide-react'
import { getProject, projects } from '../data/projects'
import { IntegrationArchitecture } from '../components/ArchitectureGraph/IntegrationArchitecture'
import { Reveal } from '../components/Reveal'

function Block({ icon: Icon, title, children }: { icon: typeof Lock; title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="glass h-full rounded-2xl p-6" aria-label={title}>
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-cyanx-400" aria-hidden="true" />
          <h2 className="font-display text-base font-semibold text-white">{title}</h2>
        </div>
        <div className="mt-3 text-sm leading-relaxed text-slate-300">{children}</div>
      </section>
    </Reveal>
  )
}

export default function ProjectDetails() {
  const { slug } = useParams()
  const project = slug ? getProject(slug) : undefined

  useEffect(() => {
    if (!project) return
    const prev = document.title
    document.title = `${project.title} | Himanshu Singh`
    return () => {
      document.title = prev
    }
  }, [project])

  if (!project) return <Navigate to="/" replace />

  const idx = projects.findIndex((p) => p.slug === project.slug)
  const prev = projects[(idx - 1 + projects.length) % projects.length]
  const next = projects[(idx + 1) % projects.length]
  const d = project.details

  return (
    <article className="relative mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8">
      <Link to="/#projects" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <ArrowLeft size={16} aria-hidden="true" /> All projects
      </Link>

      <header className="mt-6 max-w-3xl">
        <p className="eyebrow">
          Project {project.index} · {project.tagline}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">{project.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">{project.summary}</p>
      </header>

      <section className="mt-10" aria-labelledby="arch-title">
        <h2 id="arch-title" className="mb-4 font-display text-xl font-semibold text-white">
          Architecture
        </h2>
        <IntegrationArchitecture architecture={project.architecture} height={project.architecture.nodes.length > 6 ? 380 : 320} flow />
        {project.features && (
          <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" aria-label="Features">
            {project.features.map((f) => (
              <li key={f} className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200">
                <BadgeCheck size={15} className="shrink-0 text-cyanx-400" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Block icon={Target} title="Problem">
          <p>{d.problem}</p>
        </Block>
        <Block icon={Workflow} title="Integration flow">
          <ol className="space-y-2">
            {d.flow.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="font-mono text-xs text-cyanx-400">{String(i + 1).padStart(2, '0')}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </Block>
        <Block icon={Lock} title="Security">
          <p>{d.security}</p>
        </Block>
        <Block icon={Repeat} title="Transformation">
          <p>{d.transformation}</p>
        </Block>
        <Block icon={AlertTriangle} title="Error handling">
          <p>{d.errorHandling}</p>
        </Block>
        <Block icon={BadgeCheck} title="Business impact">
          <p>{d.impact}</p>
        </Block>
      </div>

      <section className="mt-10" aria-labelledby="tech-title">
        <h2 id="tech-title" className="mb-3 font-display text-xl font-semibold text-white">
          Technologies
        </h2>
        <ul className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li key={t} className="chip !text-xs">
              {t}
            </li>
          ))}
        </ul>
      </section>

      <nav className="mt-16 flex items-center justify-between gap-4 border-t border-white/10 pt-8" aria-label="More projects">
        <Link to={`/projects/${prev.slug}`} className="group max-w-[45%] text-left">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <ArrowLeft size={14} aria-hidden="true" /> Previous
          </span>
          <span className="mt-1 block text-sm font-semibold text-white group-hover:text-cyanx-300">{prev.title}</span>
        </Link>
        <Link to={`/projects/${next.slug}`} className="group max-w-[45%] text-right">
          <span className="flex items-center justify-end gap-1 text-xs text-slate-500">
            Next <ArrowRight size={14} aria-hidden="true" />
          </span>
          <span className="mt-1 block text-sm font-semibold text-white group-hover:text-cyanx-300">{next.title}</span>
        </Link>
      </nav>
    </article>
  )
}
