import { useEffect, useRef } from "react";

/**
 * ParallaxBackground — a cinematic background layer with a very slow scroll
 * parallax. Used both as:
 *
 * - Global site background (`mode="fixed"`) — always present behind every
 *   section, drifting up as the page scrolls.
 * - Section-level background (`mode="section"`) — sits absolute inside its
 *   own section container and shifts subtly as it enters the viewport.
 *
 * Design goals:
 * - Never distracting. Speed defaults to 0.15 (~15% of scroll delta) so the
 *   movement is barely perceptible — the page just "breathes."
 * - No layout shift. Uses `transform: translate3d` (compositor thread, no
 *   reflow) and a fixed/absolute layer that ignores document flow.
 * - Respects `prefers-reduced-motion` — falls back to a static image with
 *   the linear tint still applied (no parallax at all).
 * - Full-quality artwork — no crop, `background-size: cover` from center.
 *
 * The dark linear-gradient overlay is applied via a second `::after`-like
 * layer that shares the same transform so the tint moves with the image
 * (otherwise the tint would slide while the art stayed still and everything
 * would look wrong).
 */
export default function ParallaxBackground({
  src,
  mode = "section",
  speed = 0.15,
  tint = "linear-gradient(180deg, rgba(6,4,14,0.82) 0%, rgba(6,4,14,0.55) 45%, rgba(6,4,14,0.88) 100%)",
  overscan = 200,
  className = "",
  style = {},
}) {
  const layerRef = useRef(null);

  useEffect(() => {
    // Skip animation entirely for users who requested reduced motion.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return undefined;

    const el = layerRef.current;
    if (!el) return undefined;

    let raf = 0;
    let lastY = -1;

    const update = () => {
      // For fixed mode we track absolute scroll position.
      // For section mode we track the section's position relative to viewport
      // so parallax feels local to that section (no big translate at page top).
      let translateY = 0;

      if (mode === "fixed") {
        translateY = window.scrollY * -speed;
      } else {
        const parent = el.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        // Distance the section's top has traveled past the viewport top.
        // Multiplied by -speed so the background drifts up as user scrolls
        // through the section — matching the classic parallax feel.
        translateY = -rect.top * speed;
      }

      el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      raf = 0;
    };

    const onScroll = () => {
      if (raf) return; // coalesce multiple scroll events into one rAF tick
      raf = window.requestAnimationFrame(update);
    };

    // Prime once on mount so images don't pop into place on first scroll.
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [mode, speed]);

  // Base positioning — fixed mode covers the viewport, section mode covers
  // its parent. `overscan` gives the parallax room to move without exposing
  // an edge (image is a bit taller than the container).
  const baseStyle =
    mode === "fixed"
      ? {
          position: "fixed",
          inset: `-${overscan}px 0`,
          zIndex: 0,
        }
      : {
          position: "absolute",
          inset: `-${overscan}px 0`,
          zIndex: 0,
        };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden ${className}`}
      style={{ ...baseStyle, ...style }}
    >
      <div
        ref={layerRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{
          backgroundImage: [tint, `url('${src}')`].join(", "),
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
