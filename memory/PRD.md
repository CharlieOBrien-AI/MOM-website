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
- ✅ Hero with cursor-scrubbing background video (MP4 1080p primary, WebM fallback).
- ✅ Push/Pull centerpiece with cinematic Day ↔ Night video transitions.
- ✅ Premium segmented toggle with sliding pill, ARIA + keyboard support.
- ✅ Stats section with "0 ad dollars spent" replacing the 75% view-duration metric.
- ✅ Full landing page: Nav, Hero, Stats, Approach, Work, How-it-works, Voices, Contact, FAQ, Footer.
- ✅ Instrument Serif + JetBrains Mono typography throughout.
- ✅ Warm amber accent (#d4a256) — owl-appropriate, non-generic (no purple AI slop).
- ✅ `prefers-reduced-motion` respected globally + specifically in scrub / transition components.
- ✅ Data-testid on every interactive + critical element.

## Iteration 4 (Jul 2025)
- Windows/Mac quality fix: hero video source order flipped so 1080p H.264 MP4 is picked over the 720p VP9 WebM (root cause of "low quality" complaints); WebkitBackdropFilter prefixes added to inline glass styles (Nav, Footer, Work, PremiumToggle).
- Approach (#approach): new user-supplied 4K workspace video transcoded to 2560×1430 all-intra H.264 (`owl-workspace.mp4`) + VP9 WebM fallback (`owl-workspace.webm`); same scrub logic (Pull=night frame 0, Push=day end); Examples card re-anchored to new monitor coords (47.35% / 28.9% / 32.4% / 39.1%); wrapper aspect = 2560/1430.
- Approach copy: static headline "Most brands *push* content, ignoring what *pulls* audiences." (push=muted italic, pulls=accent italic); toggle caption lines deleted; small card = metaphor line only ("Like a crowd gathering around a great performer." / "Like handing flyers to strangers.").
- Stats: leaves background removed; eyebrow → "// The results speak".
- Section order: How-it-works now before Recent-work.
- Eyebrows rewritten site-wide (copywriter pass): Hero "// The storytelling studio for founders", Approach "// Why pull wins", HowItWorks "// Simple by design", Work "// Proof in the wild", Voices "// Earned, not bought", FAQ "// Before you ask".
- Deleted unused night-to-day / day-to-night videos (~55MB).

## Iteration 5 (Jul 2025)
- Examples card on the Approach monitor visible in BOTH modes (content swaps Push/Pull).
- Eyebrow headings rolled back to originals (Stats keeps "// The results speak").
- Stats: 300+ caption → "Videos produced."
- HowItWorks: carousel replaced by vertical 6-step flow with ↓ connectors — heading "How We Create Content That *Pulls People In.*"; steps: Audience Research / Story Development / Production / Retention Editing / Distribution / Trust, each = name + one-sentence outcome + 3 bullets.
- Windows performance: orbs no longer use `filter: blur(90px)` (biggest GPU cost), Approach 19MB video lazy-loads via IntersectionObserver, MP4s confirmed faststart.
- Glass UI v2: `.mo-glass`/`.mo-glass-strong` lighter translucent gradients + blur/saturate/brightness backdrop + rim light + subtle text-shadow for readability.

## Prioritized Backlog
- P1 — Contact form → email backend (currently `mailto:` on the Book-a-call CTA).
- P1 — Additional case-study pages (Work cards currently link to `#contact`).
- P2 — Analytics (scroll depth, toggle usage).
- P2 — Mobile-specific polish for the scrub interaction (currently maps horizontal touch position, good but untested on device).
- P2 — CDN-optimize / lazy-load videos for slower connections.

## Non-goals (per user)
- No backend, no database, no auth.
