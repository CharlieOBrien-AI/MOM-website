import { useEffect, useRef, useState } from "react";

/**
 * SiteBackground — the ONE continuous cinematic backdrop the entire site
 * floats above. Rendered ONCE at the App level (outside ReactLenis so the
 * Lenis transform on the scroll root doesn't turn the fixed layer into a
 * scroll-locked layer).
 *
 * How it works
 * ------------
 * We have a single tall image on disk: /images/bg/site-bg.webp. It's built
 * by vertically stacking the tree-branch purple-sky (attachment #3) on
 * top of the misty-valley cabin (bg-3.webp) with no gap between them —
 * one continuous cinematic image.
 *
 * This component renders that image once, pinned to the viewport, and
 * shifts it upward *slowly* as the user scrolls the page. The math is
 * calibrated so that:
 *
 *   • at scrollY = 0                        →  translateY = 0
 *     the viewport is looking at the TOP of the image (tree-branch sky)
 *
 *   • at scrollY = full document scrollable →  translateY = -(imgH - vpH)
 *     the viewport is looking at the BOTTOM of the image (misty valley)
 *
 * Because the translation range EXACTLY equals `imageHeight − viewportHeight`,
 * we never expose an edge and we never crop content off the top or bottom.
 * The image simply "reveals" from top to bottom as the visitor journeys
 * through the page — a real parallax effect, not a 1:1 scroll.
 *
 * The image is sized with `background-size: 100% auto` so it always fills
 * the full viewport width at natural aspect ratio (no distortion, no
 * horizontal cropping). Vertical range then falls out of the width scale.
 *
 * On top of the sky sits a soft linear-gradient tint (`.mo-bg-orbs`-style)
 * so text on any transparent section stays readable no matter which part
 * of the sky is behind it.
 *
 * Reduced motion
 * --------------
 * If the user has `prefers-reduced-motion: reduce`, we skip the scroll
 * hook and center the image statically — no drift at all.
 */
export default function SiteBackground({
  src = "/images/bg/site-bg.webp",
  /** Portion of the visible parallax range that a full document scroll
   *  should traverse. 1.0 = the whole image reveals across the page.
   *  Below 1.0 = slower drift (image doesn't fully reveal). */
  revealFraction = 1.0,
  /** Dark tint gradient painted on top of the sky. Keep it moderate so the
   *  nightscape reads while text remains legible on transparent sections. */
  tint = "linear-gradient(180deg, rgba(6,4,14,0.42) 0%, rgba(6,4,14,0.30) 45%, rgba(6,4,14,0.55) 100%)",
}) {
  const layerRef = useRef(null);
  const [imgAspect, setImgAspect] = useState(null);

  // Preload the image so we can read its natural aspect ratio.
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      setImgAspect(img.naturalHeight / img.naturalWidth);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    if (!imgAspect) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return undefined;

    const el = layerRef.current;
    if (!el) return undefined;

    let raf = 0;

    const update = () => {
      raf = 0;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Image is sized `100% auto` — its rendered height is vw * aspect.
      const imgH = vw * imgAspect;
      // How far the image can shift up before its bottom leaves the viewport.
      const maxTranslate = Math.max(0, imgH - vh);
      const doc = document.documentElement;
      const maxScroll = Math.max(
        1,
        (doc.scrollHeight || document.body.scrollHeight) - vh,
      );
      const t = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      const translate = -t * maxTranslate * revealFraction;
      el.style.transform = `translate3d(0, ${translate.toFixed(1)}px, 0)`;
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
  }, [imgAspect, revealFraction]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        // Pure-black safety-net colour while the image downloads.
        backgroundColor: "#000",
      }}
    >
      {/* Layer 1: the sky itself, translated as user scrolls. */}
      <div
        ref={layerRef}
        className="will-change-transform"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          // Give the layer enough room to hold the image at 100% width
          // (image is `100% auto`, so ends up vw × aspect tall). 300vh is
          // a generous ceiling; the transform above pins the visible slice.
          height: "300vh",
          backgroundImage: `url('${src}')`,
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Layer 1b — Sky Ambience: two slow-drifting cloud strata that keep
          the nightscape feeling alive even when the visitor stops scrolling.
          Purely additive: soft radial-gradient blobs, blended with the sky
          via mix-blend-mode: screen, at low opacity and drifting horizontally
          on a very long CSS animation loop. Auto-suspends under
          prefers-reduced-motion (via the .mo-cloud-drift utility class
          defined in index.css). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          // Screen blend lets the pale wisps lighten the sky without
          // ever darkening it. mix-blend-mode is hardware-composited.
          mixBlendMode: "screen",
        }}
      >
        {/* Upper stratum — smaller, faster, slightly warmer. */}
        <div
          className="mo-cloud-drift mo-cloud-drift--upper"
          style={{
            position: "absolute",
            top: "-4%",
            left: "-100%",
            width: "300%",
            height: "70%",
            // Layered radial gradients form soft, elongated blobs that
            // read as high-altitude wisps. Each stop is intentionally
            // low-alpha so nothing punches through the nightscape.
            backgroundImage:
              "radial-gradient(ellipse 620px 140px at 12% 32%, rgba(200,178,240,0.16), rgba(200,178,240,0) 70%),"
              + "radial-gradient(ellipse 780px 160px at 34% 58%, rgba(190,168,232,0.12), rgba(190,168,232,0) 72%),"
              + "radial-gradient(ellipse 560px 120px at 55% 22%, rgba(210,190,250,0.10), rgba(210,190,250,0) 70%),"
              + "radial-gradient(ellipse 900px 180px at 78% 68%, rgba(180,158,222,0.14), rgba(180,158,222,0) 74%),"
              + "radial-gradient(ellipse 500px 100px at 92% 40%, rgba(220,200,255,0.11), rgba(220,200,255,0) 70%)",
            filter: "blur(4px)",
            opacity: 0.85,
          }}
        />
        {/* Lower stratum — larger, slower, cooler; drifts in the opposite
            direction so the two layers gently pass one another. */}
        <div
          className="mo-cloud-drift mo-cloud-drift--lower"
          style={{
            position: "absolute",
            bottom: "-6%",
            left: "-100%",
            width: "300%",
            height: "62%",
            backgroundImage:
              "radial-gradient(ellipse 1100px 200px at 18% 50%, rgba(140,120,190,0.14), rgba(140,120,190,0) 72%),"
              + "radial-gradient(ellipse 900px 170px at 42% 78%, rgba(120,102,180,0.11), rgba(120,102,180,0) 74%),"
              + "radial-gradient(ellipse 1300px 220px at 66% 30%, rgba(150,130,200,0.12), rgba(150,130,200,0) 72%),"
              + "radial-gradient(ellipse 800px 150px at 88% 60%, rgba(160,140,210,0.10), rgba(160,140,210,0) 70%)",
            filter: "blur(6px)",
            opacity: 0.7,
          }}
        />
      </div>

      {/* Layer 2: fixed-to-viewport soft tint so text stays readable no
          matter which portion of the sky is currently in frame. */}
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
