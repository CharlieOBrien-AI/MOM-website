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

## Iteration 6 (Jun 2026)
- Branding: "Midnight Owl" → "Midnight Owl Media" in Nav + Footer.
- New hero video (user-supplied 4K HEVC owl/moon/city): transcoded to 1080p all-intra H.264 30fps (`owl-hero.mp4`, CRF19) + 720p VP9 WebM fallback (`owl-hero.webm`) for browsers without H.264 (incl. headless). Poster `images/owl-hero-poster.jpg`. Old left-right videos deleted (~51MB).
- No-zoom hero: section aspect-locked 16/9 on lg+ (video maps 1:1, owl/moon/city never cropped); below lg the video renders as an in-flow 16:9 block stacked above the headline.
- Mobile hero: plain autoplaying looped video (`owl-hero-mobile.mp4/.webm`, 442KB/215KB) — no scrubbing (`useIsCompact` matchMedia max-width:1023px in HeroScrubVideo.jsx).
- Push/Pull switch: replaced pill toggle with SkyToggle (`components/ui/sky-toggle.jsx`, styled-components) — sun/day = Push, moon/night = Pull, flanked by highlighted Push/Pull text labels (PremiumToggle.jsx keeps same value/onChange API + testids).
- Scroll-reveal animations site-wide via `Reveal.jsx` (IntersectionObserver + `.mo-reveal` CSS, staggered delays, reduced-motion safe).
- Mobile "Stories we've told": swipeable one-card carousel (touch swipe + prev/next + dots + 01/03 counter); desktop keeps 3-col grid. HowItWorks carousel also gained touch swipe.
- Testing: iteration_2.json — frontend 100% pass, zero console errors.
- Fix round (same day): (1) scrub mapping inverted (t=0 owl looks right → cursor-right maps to t=0) so the owl's head follows the cursor; (2) startup lag fixed — seeks are gated to buffered ranges (no decoder stalls while streaming), instant `<img>` poster layer behind both hero videos, files re-encoded smaller (mp4 CRF22 24.5MB, webm CRF36 20.8MB); (3) Push/Pull labels moved INSIDE the sky toggle track (current mode shown opposite the knob, white JetBrains Mono + text-shadow), flanking label buttons removed — testids toggle-push/toggle-pull now on the inner spans, sky-toggle-input on the checkbox.

## Iteration 7 (Feb 2026)
- Push/Pull toggle labels: bolder + purple. `.theme-switch__label` now `font-weight: 900`, size `0.62em`, letter-spacing `0.18em`, color `#d9b8ff` with a multi-layer text-shadow (white halo + purple glow) so labels stay readable against the day-sky (blue) and night-sky (near-black) backgrounds. Bumped `z-index` above the sun/moon knob.
- Hero video sharpness: re-encoded `owl-hero.mp4` at 1920×1080 all-intra x264 QP 21 (was ~12.4 Mbps → now ~21 Mbps, ~40 MB), `-preset slower -tune film -aq-mode 3 -psy-rd 1.2,0.15` + `unsharp` filter for perceived detail. Removed the 720p VP9 WebM (never picked by browsers that decode H.264; scrubbing needs all-intra mp4). Poster JPG regenerated at higher quality (~150 KB, `q:v 2` + unsharp).
- Cleanup: `owl-hero.webm` source line removed from `HeroScrubVideo.jsx`; old WebM/backup files deleted from `public/videos/`.

## Iteration 8 (Jun 2026)
- Push/Pull slow-connection fix: until `owl-workspace.mp4` is FULLY buffered, the Push/Pull transition is a smooth night↔day crossfade between two stills (`owl-workspace-night.jpg` / new `owl-workspace-day.jpg`); once fully buffered the video is parked on the current mode's frame and the real rAF scrub takes over (`videoLive` state in Approach.jsx). No more mid-download jank.
- Hero progressive quality: 3-tier ladder `owl-hero-low.mp4` (640×360 all-intra, 1.7MB — interactive in seconds) → `owl-hero-mid.mp4` (1280×720, 9.5MB) → `owl-hero.mp4` (1080p, 41MB). Each higher tier streams in the background and is frame-synced + crossfaded in once fully buffered (loadStage/stage chain in HeroScrubVideo.jsx). Low tier has a VP9 WebM fallback (headless / no-H.264 browsers).
- Examples card corners now match the LG monitor's near-square screen corners: `borderRadius: clamp(3px, 0.42vw, 8px)` (desktop on-monitor card only; mobile card keeps rounded-2xl).
- Push examples = 3 user-supplied ad reels (no titles/names), autoplaying muted loops on the monitor: `/videos/examples/push-{1,2,3}.mp4` (360×640 CRF27, ~1MB each) + VP9 WebM fallbacks. Pull examples unchanged.
- New NightSkyBreak section directly below the hero: user's purple night-sky/tree artwork as a plain full-width image (`images/night-sky.jpg`) — no filter, no zoom, no crop.
- Push/Pull toggle reverted to the ORIGINAL segmented pill (sliding white pill, JetBrains Mono labels) restored from git history; SkyToggle no longer used.
- Verified via browser automation: hero scrub on low tier, push/pull toggle both directions, day-still crossfade fallback (no-video path), push videos playing, mobile layout.

## Iteration 9 (Jun 2026) — PC feedback fixes
- Hero text-disappearing bug fixed: video tier z-indexes had escaped their wrapper (no stacking context) and painted over the headline — video wrapper now `isolate`, content `z-10`, and tier z-indexes removed (DOM order only).
- Hero quality: 360p tier REMOVED. Starts directly on GOOD 720p (`owl-hero-mid.mp4`, 11.7MB CRF24 all-intra + VP9 WebM fallback for no-H.264 browsers); BEST 1080p (`owl-hero.mp4`) is force-downloaded via fetch()→blob (immune to Chrome suspending <video> preloads — the root cause of "never fully loads"), then frame-synced + crossfaded in. Fetch starts when base is fully buffered (or 12s fallback). Scrub now rides the buffer edge instead of freezing when the cursor maps past the download head.
- Hero filter removed: no CSS contrast/saturate filter, no radial/linear washes, no noise overlay on the hero video (mobile keeps only the small bottom blend into the next section).
- Push examples: play button on each tile opens a lightbox (portal to body, Esc/backdrop/× to close, `push-video-lightbox` / `lightbox-video` / `lightbox-close-btn` testids) playing the full 720×1280 version WITH sound (`push-{n}-hd.mp4` CRF23+AAC, `-hd.webm` VP9+Opus fallback). Tiles remain muted autoplaying previews.
- Night-sky artwork is now the Stats (section 2) BACKGROUND (`center / cover`, no overlay, no filter) — the separate NightSkyBreak section was removed/deleted.

## Prioritized Backlog
- P1 — Contact form → email backend (currently `mailto:` on the Book-a-call CTA).
- P1 — Additional case-study pages (Work cards currently link to `#contact`).
- P2 — Analytics (scroll depth, toggle usage).
- P2 — Mobile-specific polish for the scrub interaction (currently maps horizontal touch position, good but untested on device).

## Non-goals (per user)
- No backend, no database, no auth.
