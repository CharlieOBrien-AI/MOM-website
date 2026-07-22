import { useEffect, useRef } from "react";
import Hero from "./Hero";

/**
 * CinematicIntro — a scroll-driven "one fluid movement" transition from the
 * Hero video into the rest of the page.
 *
 * Layout
 * ------
 * The component renders a single 100vh container that holds the Hero. As
 * the visitor scrolls, two things happen in sync while the container
 * itself scrolls up out of view (dragging the Stats section up into
 * view immediately behind it — no wasted scroll, no empty band):
 *
 *   1. The Hero content (video + copy) drifts upward slightly (a subtle
 *      parallax tilt, capped at ~12vh so it never separates from the
 *      background rhythm).
 *   2. The Hero's opacity fades to 0 across the first ~55% of a viewport
 *      of scroll. Because the site-wide <SiteBackground /> (position:
 *      fixed, z-index 0) sits behind everything, the fade dissolves the
 *      hero into that same continuous nightscape — and Stats, floating
 *      on the exact same fixed background just below, joins it
 *      seamlessly.
 *
 * There is no sticky wrapper anymore. The old 180vh sticky pattern was
 * creating a 100vh "empty sky" band where the hero had already faded but
 * Stats hadn't scrolled up yet. Now Hero and Stats share the exact same
 * scroll distance: as one fades away, the other rides up. Zero gap.
 *
 * Reduced motion
 * --------------
 * If the visitor has `prefers-reduced-motion: reduce`, the JS hook is
 * skipped — the hero stays at opacity 1 with no drift and simply scrolls
 * off naturally. Stats follows below.
 */
export default function CinematicIntro() {
  const wrapRef = useRef(null);
  const heroLayerRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const heroLayer = heroLayerRef.current;
    if (!wrap || !heroLayer) return undefined;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return undefined;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const winH = window.innerHeight;

      // How many pixels have we scrolled past the top of the wrapper?
      const scrolled = Math.max(0, -rect.top);

      // Fade over ~80% of the wrapper height (~70vh of scroll on a 88vh
      // wrapper). Because the wrapper is a bit shorter than the viewport,
      // Stats already peeks a few vh at the bottom of the initial view —
      // by the time it fully rides up, the hero has finished dissolving.
      const wrapH = wrap.offsetHeight || winH;
      const transitionLen = Math.max(1, wrapH * 0.8);
      const t = Math.min(1, Math.max(0, scrolled / transitionLen));

      // Soft cubic ease — starts gentle, commits toward the end.
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Modest parallax drift (max 10vh) so the copy feels camera-tilted
      // without visibly separating from the page rhythm.
      const driftPx = -eased * (winH * 0.1);
      heroLayer.style.transform = `translate3d(0, ${driftPx.toFixed(1)}px, 0)`;
      heroLayer.style.opacity = (1 - eased).toFixed(3);
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
      style={{ height: "88vh", overflow: "hidden" }}
      data-testid="cinematic-intro-wrap"
    >
      {/* Hero layer — drifts upward and fades to opacity 0 as user scrolls.
          `will-change` keeps the transform+opacity on their own compositor
          layer so scroll stays butter-smooth on mid-range hardware. */}
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
    </div>
  );
}
