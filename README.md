# Himanshu Singh — SAP BTP Integration Engineer Portfolio

React + TypeScript + Vite + React Three Fiber + Tailwind. A spatial, "integration control center" portfolio with a 3D Integration Core, interactive architectures, an ambient 3D fish, a 3D skills stack, and a Production Reality incident board.

## 1. Install Node.js
Install Node 20+ LTS from https://nodejs.org (or `nvm install 20`). Check: `node -v && npm -v`

## 2–3. Install and run
```bash
npm install
npm run dev        # http://localhost:5173
```

## 4. Production build
```bash
npm run build      # typechecks, then outputs dist/
npm run preview    # serve the build at http://localhost:4173
```

## 5–6. GitHub
Create an empty repo named `portfolio` on github.com (no README), then:
```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/himanshu-singh0007/portfolio.git
git push -u origin main
```

## 7. Deploy on Vercel
Dashboard: vercel.com → Add New → Project → import the repo → Framework "Vite" (auto) → Deploy.
CLI alternative:
```bash
npm i -g vercel
vercel login
vercel --prod
```
`vercel.json` already handles SPA rewrites (so `/projects/<slug>` works on refresh) and asset caching.

## 8. Custom domain
Vercel project → Settings → Domains → Add `yourdomain.com`. At your registrar set:
- `A` record `@` → `76.76.21.21`
- `CNAME` `www` → `cname.vercel-dns.com`
HTTPS is issued automatically. Then replace `https://himanshusingh.dev` in `index.html`, `public/sitemap.xml` and `public/robots.txt` with your real domain and redeploy.

## 9. Environment variables (optional)
Only for analytics (off by default). See `.env.example`. In Vercel: Settings → Environment Variables.

## 10. Verify production
- Open the URL; hero loads, fish visible on desktop.
- Refresh on `/projects/bank-payment-neft-rtgs` (must not 404).
- `/robots.txt`, `/sitemap.xml`, `/Himanshu_Singh_Resume.pdf` resolve.
- Lighthouse (Chrome DevTools) on mobile + desktop.
- Test with OS "reduce motion" on: fish and auto-motion stop.

## Resume
`public/Himanshu_Singh_Resume.pdf` is your uploaded resume. Replace the file (same name) to update it. Note it contains your phone number and is publicly downloadable.

## Structure
```
src/components/  Hero, Navbar, IntegrationCore, ProjectCard3D, ArchitectureGraph,
                 ArchitectureLab, Skills, Experience, Metrics, Troubleshooting, Contact
src/three/       FishScene, IntegrationNodes, DataParticles
src/data/        projects, skills, experience, architectures, incidents
src/pages/       Home, ProjectDetails (lazy)
src/hooks/       useDevice (tier/reduced-motion), useInView, useCountUp
```
Edit content only in `src/data/`.

## Checklists
**Performance:** lazy-loaded 3D chunks · canvases pause when offscreen (`frameloop`) · DPR capped by device tier · instanced/low-poly geometry · particles/fish reduced or disabled on mobile/low tier · reduced-motion disables fish · WebGL failure falls back to SVG · manual chunks for three/r3f/motion.
**Accessibility:** semantic landmarks and headings · keyboard-reachable nodes and cards · visible focus · aria-labels · SVG fallbacks for 3D · `prefers-reduced-motion` honoured.
**SEO:** title, meta description, Open Graph/Twitter tags, favicon, robots.txt, sitemap.xml. Note: some social scrapers ignore SVG OG images; export `public/og-image.svg` to a 1200×630 PNG and update the `og:image` URL.
**Recruiter:** metrics limited to 125+/20+/5+/0; no fake clients, certifications or testimonials; resume one click away; contact is email + LinkedIn + GitHub only.
