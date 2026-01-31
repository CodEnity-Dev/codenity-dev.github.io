# CodEnity — Website Plan

## Overview

This plan defines the scope, tech choices, content needs, timeline, and next steps to build a professional, SEO-friendly, GitHub Pages-hosted website for CodEnity that consolidates your YouTube channel, apps (Google Play), and browser extensions (Chrome, Firefox, Edge).

## Goals (from your answers)

- Primary actions: Watch YouTube, install apps/extensions, subscribe, and download resources.
- Audience: All user types (end users, developers, learners, enterprises).
- Hosting: GitHub Pages (organization repo).
- Main feature: Embedded YouTube playlists, app/extension showcase with install badges and download links, video/manual gallery.

## Core Pages & Structure

- Home (hero with tagline, CTA buttons to YouTube / Apps / Extensions)
- About (mission, `CodEnity: Bridging the Gap Between Code and Craft`)
- Apps & Extensions (per-platform pages with badges, screenshots, videos, descriptions)
- YouTube (embedded playlist and featured videos)
- Projects / Demos (detailed pages for each app/extension)
- Blog / News / Changelog
- Docs / Manuals (user guides and video tutorials)
- Contact (contact form or links)
- Legal (Privacy Policy, Terms) — optional but recommended for app links and analytics

## Visual Identity (initial proposal)

- Logo: you already have a logo — we'll need the source file (SVG preferred).
- Suggested color palette (we can iterate):
  - Primary: #0B5FFF (vivid blue)
  - Accent: #FF6A00 (warm orange)
  - Background: #F8FAFC (light)
  - Surface / Text Dark: #0F1724
  - Neutral: #64748B
- Fonts: Google Fonts `Inter` (UI) + `Poppins` or `Roboto Slab` for headings.
- Imagery: app screenshots, short demo videos, YouTube thumbnails.

## Tech Stack Recommendation

Two solid options; I recommend starting with **Jekyll** for the MVP because it's native to GitHub Pages and requires minimal build/deploy work. If you prefer a more modern stack later, we can migrate to **Astro**.

- Option A (recommended MVP): Jekyll + plain HTML/CSS (Tailwind CSS optional)
  - Pros: Native GH Pages support, simple workflow, markdown content, easy for you to edit.
  - Cons: Less modern component model than newer frameworks.

- Option B (advanced, optional): Astro (static build) + Tailwind + components
  - Pros: Modern, performant, component-based; excellent SEO and performance.
  - Cons: Requires build step and GitHub Actions or `gh-pages` deployment to GH Pages branch.

Third-party services and libraries:

- YouTube embeds (playlist & video embeds)
- Install badges (static SVG badges or platform assets)
- Image optimization (use compressed WebP/AVIF builds)
- Forms: Formspree / Getform / Google Forms (no backend required)
- Analytics: Google Analytics (GA4) or Plausible (privacy-friendly)
- Search: Simple client-side search (Lunr.js) or hosted Algolia for large content
- Sitemap & robots.txt and JSON-LD structured data for SEO

## SEO & Performance

- Add structured data (Organization, WebSite, SoftwareApplication), Open Graph, and Twitter card meta.
- Page-level SEO: unique title, meta description, canonical, and schema for each app/project.
- Generate sitemap.xml and robots.txt.
- Add social preview image (1200×630) — I can create a template image using your logo.

## Content & Assets Needed (what I need from you)

- Platform URLs: YouTube channel, Google Play store listing(s), Chrome Web Store, Mozilla Add-ons, Edge Add-ons.
- `logo.svg` or high-res PNG (SVG preferred). If you only have PNG, upload it and I will generate an SVG-like asset if possible.
- App/extension screenshots, demo videos, and APK (or published store links).
- Short hero tagline (you provided) and 1–2 paragraph description (you provided a short tagline; I can expand it).
- App descriptions for each platform (or I can draft them from store listings).
- Any author / organization details for the About page.
- (Optional) Google Analytics ID, social handles, and a privacy policy text if available.

## Workflow & Content Updates

- Content-first approach: site content will be markdown files in the repo for easy editing.
- You will update directly via the GitHub UI or via PRs; no CMS required for MVP.
- For forms, we will use a third-party provider so no backend is needed.

## Security & Privacy

- Use HTTPS (GitHub Pages provides this).
- If analytics are enabled, add a minimal privacy notice; implement a cookie banner only if needed.

## Timeline & Milestones (MVP-first approach)

- Phase 1 — Discovery & Plan (done): finalize tech choice and collect assets (2 days)
- Phase 2 — Design: palette, hero mockup, and templates (2–3 days)
- Phase 3 — Scaffold & Implement core pages (Home, Apps, YouTube, About) (3 days)
- Phase 4 — Content population & embeds (2–3 days)
- Phase 5 — SEO, testing, accessibility, performance tuning (2 days)
- Phase 6 — Final review & launch to GitHub Pages (1 day)
  Estimated total: 10–14 working days for a polished MVP, depending on content readiness.

## Deliverables

- A GitHub Pages site scaffold (Jekyll) in your organization repo.
- Responsive templates for Home, App pages, YouTube embeds, and Blog.
- SEO meta, sitemap, and social preview image template.
- Short README with editing instructions for you.

## Next Steps (what I will do once you confirm)

1. Choose stack (Jekyll recommended) and scaffold repo.
2. Create initial templates and a style guide based on the palette above.
3. Populate the Home and Apps landing pages with placeholder content.
4. Add YouTube playlist embed and install badge components.

## Questions / Items I still need from you

1. Please share the platform URLs (YouTube, Google Play, Chrome, Mozilla, Edge) or tell me to pull them.
2. Please upload your `logo.svg` (or PNG) to the repo or provide a download link.
3. Do you prefer the site built with `Jekyll` (fast, GH Pages native) or `Astro` (modern, requires build)? I recommend `Jekyll` for MVP.
4. Repo name for deployment (organization repo) and whether you want the site at `https://<org>.github.io` or a custom domain later.
5. Any specific sites you like for visual inspiration (optional).

---

If this plan looks good I will scaffold the repo and start Phase 2 design work. If you want any changes to the palette, structure, or tech choice, tell me which and I will update the plan.
