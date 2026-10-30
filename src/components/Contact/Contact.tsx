import { useState } from 'react'
import { Check, Copy, Download, FileText, Github, Linkedin, Mail } from 'lucide-react'
import { links } from '../../data/experience'
import { Reveal, SectionHeading } from '../Reveal'

export function Resume() {
  return (
    <section id="resume" className="section !py-12" aria-labelledby="resume-title">
      <Reveal>
        <div className="glass flex flex-col items-start justify-between gap-6 rounded-3xl p-8 sm:flex-row sm:items-center">
          <div>
            <p className="eyebrow">Resume</p>
            <h2 id="resume-title" className="mt-2 font-display text-2xl font-semibold text-white">
              Himanshu Singh: SAP BTP CPI &amp; PI/PO Consultant
            </h2>
            <p className="mt-1 text-sm text-slate-400">Skills, projects and experience in a one-page PDF.</p>
            <dl className="mt-4 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
              <dt className="text-slate-500">Education</dt>
              <dd className="text-slate-300">B.Tech, Computer Science Engineering — Pranveer Singh Institute of Technology, Kanpur</dd>
              <dt className="text-slate-500">Certifications</dt>
              <dd className="text-slate-300">SAP CPI (Udemy) · SAP PI/PO (Udemy) · DBMS (Infosys Springboard)</dd>
            </dl>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={links.resume} download="Himanshu_Singh_Resume.pdf" className="btn-primary">
              <Download size={16} aria-hidden="true" /> Download Resume
            </a>
            <a href={links.resume} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <FileText size={16} aria-hidden="true" /> View Resume
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable: the mailto link still works */
    }
  }

  const rows = [
    { icon: Mail, label: 'Email', value: links.email, href: `mailto:${links.email}` },
    { icon: Linkedin, label: 'LinkedIn', value: links.linkedinLabel, href: links.linkedin },
    { icon: Github, label: 'GitHub', value: links.githubLabel, href: links.github },
  ]

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <SectionHeading
        eyebrow="Contact"
        title="Open a channel"
        lead="Hiring for an SAP BTP integration role, or need an integration built or fixed? Reach out."
      />
      <h2 id="contact-title" className="sr-only">
        Contact
      </h2>

      <Reveal className="mt-10">
        <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyanx-400 to-transparent" aria-hidden="true" />
          <p className="font-display text-xl font-semibold text-white">Himanshu Singh</p>
          <p className="font-mono text-xs text-slate-500">SAP BTP Integration Engineer</p>

          <ul className="mt-6 space-y-3">
            {rows.map((r) => (
              <li key={r.label}>
                <a
                  href={r.href}
                  target={r.label === 'Email' ? undefined : '_blank'}
                  rel={r.label === 'Email' ? undefined : 'noopener noreferrer'}
                  className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-cyanx-400/50"
                >
                  <r.icon size={18} className="text-cyanx-400" aria-hidden="true" />
                  <span className="w-20 font-mono text-[11px] uppercase tracking-widest text-slate-500">{r.label}</span>
                  <span className="truncate text-sm text-slate-200 group-hover:text-white">{r.value}</span>
                </a>
              </li>
            ))}
          </ul>

          <button type="button" onClick={copy} className="btn-ghost mt-6">
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {copied ? 'Email copied' : 'Copy email address'}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>
        </div>
      </Reveal>
    </section>
  )
}
