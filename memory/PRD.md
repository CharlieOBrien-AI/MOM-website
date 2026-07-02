# Midnight Owl Media — Cinematic Landing Page

## Original Problem Statement
Create a premium, cinematic landing page hero that feels calm, elegant, and interactive.
- Communicate contrast between **Pull Content** and **Push Content** using an owl metaphor.
- Hero background is a muted video whose currentTime is driven by horizontal mouse position (Apple-style scrubbing).
- Push/Pull toggle plays supplied transition videos (Night ↔ Day) then resolves to static owl images.
- Fonts: **Instrument Serif** (headings) + **JetBrains Mono** (all other text).
- Aesthetic: Apple / Linear / Stripe / Vercel — minimal, elegant, no loud gradients, no bounce.
- Respect `prefers-reduced-motion`.

## Architecture
- **Frontend**: React + CRACO, TailwindCSS, shadcn/ui components, lucide-react icons.
- **Backend**: Not used (frontend-only per user request).
- **Assets**: Videos + owl stills served from `/app/frontend/public/`.
  - `videos/left-right.{webm,mp4}` — 16s scrub-controlled background video (all-intra keyframes).
  - `videos/night-to-day.{webm,mp4}` — 5s Pull → Push transition.
  - `videos/day-to-night.{webm,mp4}` — 5s Push → Pull transition.
  - `images/owl-night.jpg`, `images/owl-day.jpg` — extracted keyframes.

## Core Components
- `HeroScrubVideo` — RAF-driven eased currentTime scrubbing (EASE=0.14, DEADBAND=0.02, 30Hz seek cap).
- `PushPullVisual` — layered still images + two transition videos with crossfade.
- `PremiumToggle` — segmented switch with sliding pill (300ms cubic-bezier), keyboard accessible.
- `Nav`, `Hero`, `Stats`, `Approach`, `Work`, `HowItWorks`, `Voices`, `Contact`, `FAQ`, `Footer`.

## What's Implemented (Dec 2025)
- ✅ Hero with cursor-scrubbing background video (WebM primary, MP4 fallback).
- ✅ Push/Pull centerpiece with cinematic Day ↔ Night video transitions.
- ✅ Premium segmented toggle with sliding pill, ARIA + keyboard support.
- ✅ Stats section with "0 ad dollars spent" replacing the 75% view-duration metric.
- ✅ Full landing page: Nav, Hero, Stats, Approach, Work, How-it-works, Voices, Contact, FAQ, Footer.
- ✅ Instrument Serif + JetBrains Mono typography throughout.
- ✅ Warm amber accent (#d4a256) — owl-appropriate, non-generic (no purple AI slop).
- ✅ `prefers-reduced-motion` respected globally + specifically in scrub / transition components.
- ✅ Data-testid on every interactive + critical element.

## Prioritized Backlog
- P1 — Contact form → email backend (currently `mailto:` on the Book-a-call CTA).
- P1 — Additional case-study pages (Work cards currently link to `#contact`).
- P2 — Analytics (scroll depth, toggle usage).
- P2 — Mobile-specific polish for the scrub interaction (currently maps horizontal touch position, good but untested on device).
- P2 — CDN-optimize / lazy-load videos for slower connections.

## Non-goals (per user)
- No backend, no database, no auth.
