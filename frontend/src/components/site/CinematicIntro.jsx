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
 *   2. A pure-black overlay pinned to the sticky viewport gradually
 *      grows more opaque (opacity 0 → 1 over the transition zone),
 *      fading the entire hero into a solid dark backdrop.
 *   3. The next section on the page (Stats / parallax content) sits in
 *      normal document flow right after this wrapper — because of the
 *      sticky container the visitor is already scrolled well into the
 *      document when the black overlay finishes, so the next section
 *      appears to "slide up from the bottom" beneath the fading hero.
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
 * viewport for the wrapper's height, but the overlay stays at opacity 0
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
      heroLayer.style.transform = `translate3d(0, ${driftPx.toFixed(1)}px, 0)`;

      // Overlay opacity — solid black by the end of the transition zone.
      fade.style.opacity = eased.toFixed(3);
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
        {/* Layer that drifts upward as the fade opacity rises. `will-change`
            keeps the transform on its own compositor layer so scroll stays
            butter-smooth on mid-range hardware. */}
        <div
          ref={heroLayerRef}
          className="will-change-transform"
          style={{ position: "absolute", inset: 0 }}
          data-testid="cinematic-intro-hero-layer"
        >
          <Hero />
        </div>

        {/* Fade-to-black overlay — grows from opacity 0 → 1 as the visitor
            scrolls through the transition zone. When it hits 1 the hero is
            entirely covered and the next section (already in normal flow
            below the wrapper) reads as sliding up from the bottom. */}
        <div
          ref={fadeRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: "#000",
            opacity: 0,
            zIndex: 30,
          }}
          data-testid="cinematic-intro-fade"
        />
      </div>
    </div>
  );
}
