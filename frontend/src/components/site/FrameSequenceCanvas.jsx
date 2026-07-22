import { useEffect, useRef, useState } from "react";

/**
 * FrameSequenceCanvas — draws a preloaded image sequence to a <canvas>,
 * driven by a caller-provided `idxRef` (mutable ref holding the desired
 * fractional frame index). Zero video decoders, zero seek latency:
 * on every animation frame we round the target index and blit the
 * matching <img> onto the canvas. Cover-fit is computed manually so
 * we get the same "object-fit: cover" behavior as the previous video.
 *
 * The component owns the preload lifecycle. It also renders a poster
 * <img> underneath the canvas so the first paint is instantaneous
 * even before a single frame has downloaded.
 */
export default function FrameSequenceCanvas({
  frameCount,
  framesBase,          // e.g. "/hero-frames/frame_"
  ext = "webp",
  digits = 4,
  posterSrc,           // shown until the first frame is drawn
  idxRef,              // ref whose .current holds fractional frame index
  onReady,             // called once with true when first frame paints
  onProgress,          // called with fraction 0..1 as frames load
  priorityCount = 12,  // load these first (evenly spaced key frames) for a fast interactive start
  className = "",
  style,
  testId,
}) {
  const canvasRef = useRef(null);
  const posterRef = useRef(null);
  const imagesRef = useRef([]);
  const loadedRef = useRef(new Uint8Array(frameCount));
  const currentIdxRef = useRef(-1);
  const rafRef = useRef(null);
  const firstPaintRef = useRef(false);
  const [firstPaint, setFirstPaint] = useState(false);

  // ---------------------------------------------------------------
  // Preload — key frames first (fast interactivity), then the rest.
  // ---------------------------------------------------------------
  useEffect(() => {
    const imgs = new Array(frameCount);
    imagesRef.current = imgs;
    loadedRef.current = new Uint8Array(frameCount);
    let cancelled = false;
    let loadedTotal = 0;

    const url = (i) =>
      `${framesBase}${String(i).padStart(digits, "0")}.${ext}`;

    const makeImg = (i) => {
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.onload = () => {
        if (cancelled) return;
        loadedRef.current[i] = 1;
        loadedTotal += 1;
        if (onProgress) onProgress(loadedTotal / frameCount);
      };
      img.onerror = () => {
        if (cancelled) return;
        loadedTotal += 1;
        if (onProgress) onProgress(loadedTotal / frameCount);
      };
      img.src = url(i);
      imgs[i] = img;
    };

    // Priority set: evenly spaced sample of frames so scrubbing has
    // something reasonable to show anywhere along the timeline, even
    // before the rest of the sequence arrives.
    const priorities = new Set();
    const n = Math.min(priorityCount, frameCount);
    for (let k = 0; k < n; k++) {
      priorities.add(Math.round((k * (frameCount - 1)) / Math.max(1, n - 1)));
    }
    priorities.forEach((i) => makeImg(i));

    // Fill the rest, but stagger a touch to keep the main thread breathing
    // on slower devices during the initial burst.
    let i = 0;
    const scheduleNext = () => {
      if (cancelled) return;
      while (i < frameCount && priorities.has(i)) i++;
      if (i >= frameCount) return;
      makeImg(i);
      i++;
      // Next microtask — the browser will parallelise the actual fetches.
      Promise.resolve().then(scheduleNext);
    };
    scheduleNext();

    return () => {
      cancelled = true;
      // Abort in-flight decodes/fetches — setting src to '' cancels loading
      // on most browsers, and drops references so images can be GC'd.
      for (let k = 0; k < imgs.length; k++) {
        const im = imgs[k];
        if (im) {
          im.onload = null;
          im.onerror = null;
        }
      }
      imagesRef.current = [];
    };
  }, [frameCount, framesBase, ext, digits, priorityCount, onProgress]);

  // ---------------------------------------------------------------
  // Draw loop — rAF-driven cover-fit blit.
  // ---------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    let disposed = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        currentIdxRef.current = -1; // force redraw
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("resize", resize);

    const findLoaded = (idx) => {
      const loaded = loadedRef.current;
      const imgs = imagesRef.current;
      if (loaded[idx] && imgs[idx]) return imgs[idx];
      // Search outward for the nearest loaded frame.
      for (let d = 1; d < frameCount; d++) {
        const a = idx - d;
        if (a >= 0 && loaded[a] && imgs[a]) return imgs[a];
        const b = idx + d;
        if (b < frameCount && loaded[b] && imgs[b]) return imgs[b];
      }
      return null;
    };

    const draw = () => {
      if (disposed) return;
      const target = idxRef.current ?? 0;
      const idx = Math.max(0, Math.min(frameCount - 1, Math.round(target)));
      if (idx !== currentIdxRef.current) {
        const img = findLoaded(idx);
        if (img && img.naturalWidth > 0) {
          const iw = img.naturalWidth;
          const ih = img.naturalHeight;
          const cw = canvas.width;
          const ch = canvas.height;
          // Cover-fit — same behaviour as CSS `object-fit: cover`.
          const scale = Math.max(cw / iw, ch / ih);
          const dw = iw * scale;
          const dh = ih * scale;
          const dx = (cw - dw) / 2;
          const dy = (ch - dh) / 2;
          ctx.drawImage(img, dx, dy, dw, dh);
          currentIdxRef.current = idx;
          if (!firstPaintRef.current) {
            firstPaintRef.current = true;
            setFirstPaint(true);
            if (onReady) onReady(true);
          }
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      ro.disconnect();
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [frameCount, idxRef, onReady]);

  return (
    <>
      {posterSrc ? (
        <img
          ref={posterRef}
          src={posterSrc}
          alt=""
          aria-hidden="true"
          className={className}
          style={{
            ...(style || {}),
            objectFit: "cover",
            opacity: firstPaint ? 0 : 1,
            transition: "opacity 400ms ease",
            pointerEvents: "none",
          }}
        />
      ) : null}
      <canvas
        ref={canvasRef}
        data-testid={testId}
        aria-hidden="true"
        className={className}
        style={{
          ...(style || {}),
          display: "block",
        }}
      />
    </>
  );
}
