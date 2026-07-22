import { useEffect, useRef } from "react";
import Hero from "./Hero";

/**
 * CinematicIntro — a scroll-driven "one fluid movement" transition from the
 * Hero video into the rest of the page.
 *
 * Layout
 * ------
 * The component renders a tall wrapper (180vh) with a sticky child that
 * fills the viewport (100vh) and holds the Hero. As the visitor scrolls
 * *through* the wrapper, three things happen in sync:
 *
 *   1. The Hero content (video + copy) is pushed upward by ~40vh of
 *      translation — it drifts up as if the camera is tilting.
 *   2. The Hero layer's opacity fades from 1 → 0 across the transition
 *      zone. Instead of overlaying solid black (which was creating a
 *      hard black band that read as disconnected from the purple
 *      nightscape below), we simply dissolve the video + copy away and
 *      let the site-wide <SiteBackground /> (position: fixed, z-index 0)
 *      show through. Because Stats and every section below also floats
 *      on that same SiteBackground, the transition reads as one
 *      continuous atmosphere.
 *   3. A whisper-soft violet-black gradient at the bottom edge sweetens
 *      the seam where the sticky wrapper hands off to the next section
 *      — pure tint, no hard black, purely additive to the nightscape
 *      already behind.
 *
 * The wrapper height is 180vh, so:
 *   - scrollY ∈ [0, 100vh]     → Hero fully visible, no fade
 *   - scrollY ∈ [100vh, 180vh] → transition zone (fade + drift)
 *   - scrollY ≥ 180vh          → wrapper exits, Stats is in view
 *
 * The math is expressed in vh not px so it works on any device height,
 * and the update runs from a single passive scroll listener throttled by
 * requestAnimationFrame.
 *
 * Reduced motion
 * --------------
 * If the visitor has `prefers-reduced-motion: reduce`, the JS hook is
 * skipped — the sticky container still holds the Hero at the top of the
 * viewport for the wrapper's height, but the hero opacity stays at 1
 * and the drift transform stays at 0. The visual falls back to a plain
 * hero followed by a spacer.
 */
export default function CinematicIntro() {
  const wrapRef = useRef(null);
  const stickyRef = useRef(null);
  const heroLayerRef = useRef(null);
  const fadeRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const heroLayer = heroLayerRef.current;
    const fade = fadeRef.current;
    if (!wrap || !heroLayer || !fade) return undefined;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return undefined;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const winH = window.innerHeight;
      const wrapH = wrap.offsetHeight;

      // How many pixels have we scrolled past the top of the wrapper?
      const scrolled = Math.max(0, -rect.top);

      // The sticky child pins for (wrapH - winH) of scroll — that's the
      // transition window. We fade + drift across that window only.
      const transitionLen = Math.max(1, wrapH - winH);
      const t = Math.min(1, Math.max(0, scrolled / transitionLen));

      // Ease the progress with a soft cubic so the fade starts subtly and
      // then commits toward the end.
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Hero drifts upward as we scroll through the transition — max 40vh.
      const driftPx = -eased * (winH * 0.4);
      // Fade the hero layer itself to 0 so the site-wide nightscape
      // (fixed behind everything at z-index 0) blooms through naturally.
      // Because Stats below also floats on the same background, there
      // is no perceptible seam where the sticky wrapper ends.
      heroLayer.style.transform = `translate3d(0, ${driftPx.toFixed(1)}px, 0)`;
      heroLayer.style.opacity = (1 - eased).toFixed(3);

      // Sweetener tint — a very light violet-black wash that grows in
      // during the second half of the transition to add depth without
      // ever becoming a solid black slab.
      const tintT = Math.max(0, Math.min(1, (eased - 0.35) / 0.65));
      fade.style.opacity = (tintT * 0.55).toFixed(3);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{ height: "180vh" }}
      data-testid="cinematic-intro-wrap"
    >
      {/* Sticky viewport — the Hero (video + copy) is pinned here while the
          visitor scrolls through the wrapper's 80vh transition zone. */}
      <div
        ref={stickyRef}
        className="sticky top-0"
        style={{ height: "100vh", overflow: "hidden" }}
        data-testid="cinematic-intro-sticky"
      >
        {/* Layer that drifts upward AND fades to opacity 0 as the visitor
            scrolls. `will-change` keeps the transform+opacity on their
            own compositor layer so scroll stays butter-smooth on
            mid-range hardware. */}
        <div
          ref={heroLayerRef}
          className="will-change-transform"
          style={{
            position: "absolute",
            inset: 0,
            willChange: "transform, opacity",
          }}
          data-testid="cinematic-intro-hero-layer"
        >
          <Hero />
        </div>

        {/* Soft sweetener tint — a violet-tinted vertical gradient that is
            fully transparent at the top and settles into the SiteBackground
            palette toward the bottom. It rises from opacity 0 → ~0.55 in
            the back half of the transition to deepen the atmosphere WITHOUT
            ever painting a hard black band. Because the SiteBackground is
            fixed behind this layer, the eye reads one continuous nightscape
            from Hero through Stats. */}
        <div
          ref={fadeRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,4,14,0) 0%, rgba(10,6,22,0.35) 55%, rgba(14,8,28,0.55) 100%)",
            opacity: 0,
            zIndex: 30,
          }}
          data-testid="cinematic-intro-fade"
        />
      </div>
    </div>
  );
}
