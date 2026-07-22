import { useEffect, useRef, useState } from "react";

/**
 * SiteBackground — the ONE continuous cinematic backdrop the entire site
 * floats above. Rendered ONCE at the App level (outside ReactLenis so the
 * Lenis transform on the scroll root doesn't turn the fixed layer into a
 * scroll-locked layer).
 *
 * How it works
 * ------------
 * The backdrop is a sequence of FOUR full-viewport nightscape scenes
 * (bg-1 → bg-2 → bg-3 → bg-4). Each scene lives in its own
 * `position: fixed; inset: 0; background-size: cover` layer stacked
 * behind the site UI. As the visitor scrolls the page from top to
 * bottom, we crossfade between the layers so the site journeys through
 * all four scenes end-to-end.
 *
 * Why this beats a single stacked composite image:
 *   • Every layer is `background-size: cover` at exactly 100vw × 100vh —
 *     so on mobile / tablet / desktop, every scene fills the viewport
 *     with no letterboxing and no clipping to a tiny slice.
 *   • On mobile, the earlier "one tall composite, translate up" approach
 *     could only surface ~1–2 scenes because the composite's rendered
 *     height at mobile widths barely exceeded a single viewport.
 *     Fixed-per-layer covers all viewports equally.
 *   • Each scene gets its own soft Ken-Burns-style Y drift for that
 *     cinematic-parallax feel, without doing crops or math that only
 *     work on desktop widths.
 *
 * Crossfade math
 * --------------
 * Scroll progress `t` is 0 at page top → 1 at bottom.
 * Scene N (0..N_LAYERS-1) has peak visibility at t = N / (N_LAYERS-1),
 * with a triangle-shaped opacity ramp of half-width 1/(N_LAYERS-1).
 * That guarantees adjacent scenes crossfade smoothly with no dark gaps.
 *
 * Reduced motion
 * --------------
 * Under `prefers-reduced-motion: reduce` we skip the scroll hook and
 * show only the first layer statically — the visitor still sees the
 * mood, minus every drifting animation.
 */
const DEFAULT_SCENES = [
  "/images/bg/bg-1.webp",
  "/images/bg/bg-2.webp",
  "/images/bg/bg-3.webp",
  "/images/bg/bg-4.webp",
];

export default function SiteBackground({
  scenes = DEFAULT_SCENES,
  /** Dark tint gradient painted on top of the sky. Keep it moderate so
   *  the nightscape reads while text remains legible on transparent
   *  sections. */
  tint = "linear-gradient(180deg, rgba(6,4,14,0.42) 0%, rgba(6,4,14,0.30) 45%, rgba(6,4,14,0.55) 100%)",
}) {
  const layerRefs = useRef([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      else mq.removeListener(apply);
    };
  }, []);

  useEffect(() => {
    if (reduced) return undefined;
    const layers = layerRefs.current;
    if (!layers.length) return undefined;

    const N = scenes.length;
    const halfW = 1 / Math.max(1, N - 1); // triangle half-width in scroll units
    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const vh = window.innerHeight;
      const maxScroll = Math.max(
        1,
        (doc.scrollHeight || document.body.scrollHeight) - vh,
      );
      const t = Math.min(1, Math.max(0, window.scrollY / maxScroll));

      for (let i = 0; i < N; i++) {
        const peak = i / Math.max(1, N - 1); // 0, 1/3, 2/3, 1
        const dist = Math.abs(t - peak);
        // Triangle opacity — 1 at the peak, linear to 0 at ±halfW.
        const opacity = Math.max(0, 1 - dist / halfW);
        // Soft cubic ease so crossfades don't feel linear-flat.
        const eased = opacity * opacity * (3 - 2 * opacity);
        // Subtle Y drift per layer for the parallax feel — max ±3vh so
        // it doesn't fight the scene composition.
        const drift = (t - peak) * vh * 0.06;
        const el = layers[i];
        if (!el) continue;
        el.style.opacity = eased.toFixed(3);
        el.style.transform = `translate3d(0, ${drift.toFixed(1)}px, 0) scale(1.02)`;
      }
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
  }, [reduced, scenes]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {scenes.map((src, i) => (
        <div
          key={src}
          ref={(el) => (layerRefs.current[i] = el)}
          className="will-change-transform"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${src}')`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            // Peak of scene 0 is at scroll t=0; give it full opacity as a
            // safe initial state until the scroll hook overrides.
            opacity: i === 0 ? 1 : 0,
            transform: "translate3d(0, 0, 0) scale(1.02)",
            transition:
              "opacity 260ms linear, transform 260ms linear",
          }}
        />
      ))}
      {/* Fixed-to-viewport soft tint so text stays readable no matter
          which scene is currently in frame. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: tint,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
