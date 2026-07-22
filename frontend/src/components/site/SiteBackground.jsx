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
