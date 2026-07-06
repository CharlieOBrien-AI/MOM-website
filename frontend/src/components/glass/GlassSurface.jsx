import React, { forwardRef, useCallback, useRef } from "react";

/**
 * GlassSurface — Apple-style "liquid glass" primitive.
 *
 * Layers (bottom → top):
 *   1. Backdrop blur + saturation on the wrapper (`.mo-glass`)
 *   2. Semi-transparent tint + edge highlights + drop shadow (`.mo-glass`)
 *   3. Cursor-tracked specular highlight (`.mo-glass-sheen`, positioned via
 *      CSS custom properties `--gx` / `--gy` written on mousemove)
 *   4. Ripple container (`.mo-glass-ripples`) — click spawns a liquid
 *      radial ripple that expands and fades.
 *   5. Content
 *
 * Interaction:
 *   - Hover: subtle 3D tilt (max ~4°) driven by cursor position, eased back
 *     to identity on mouseleave.
 *   - Click: ripple originates at the click point, expands out.
 *   - Everything is CSS-var / DOM driven — no React re-renders on move.
 *   - Respects `prefers-reduced-motion` (tilt + ripple auto-disabled via CSS).
 *
 * Props:
 *   as         — HTML tag or component (default "div")
 *   interactive— enables hover tilt / sheen / click ripple (default true)
 *   tilt       — max tilt degrees on each axis (default 3.5)
 *   ripple     — enable click ripple (default true)
 *   className, style, children, ...rest
 */
const GlassSurface = forwardRef(function GlassSurface(
  {
    as: Tag = "div",
    interactive = true,
    tilt = 3.5,
    ripple = true,
    className = "",
    contentClassName = "",
    style = {},
    children,
    onMouseMove,
    onMouseLeave,
    onPointerDown,
    ...rest
  },
  externalRef
) {
  const innerRef = useRef(null);
  const setRefs = useCallback(
    (node) => {
      innerRef.current = node;
      if (typeof externalRef === "function") externalRef(node);
      else if (externalRef) externalRef.current = node;
    },
    [externalRef]
  );

  const ripplesRef = useRef(null);

  const handleMove = useCallback(
    (e) => {
      const el = innerRef.current;
      if (el && interactive) {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width; // 0..1
        const py = (e.clientY - r.top) / r.height; // 0..1
        el.style.setProperty("--gx", `${(px * 100).toFixed(2)}%`);
        el.style.setProperty("--gy", `${(py * 100).toFixed(2)}%`);
        // Tilt: away from cursor on Y, toward on X (feels like glass tipping)
        const rx = (0.5 - py) * tilt * 2;
        const ry = (px - 0.5) * tilt * 2;
        el.style.setProperty(
          "--mo-glass-tilt",
          `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(
            2
          )}deg)`
        );
      }
      if (typeof onMouseMove === "function") onMouseMove(e);
    },
    [interactive, tilt, onMouseMove]
  );

  const handleLeave = useCallback(
    (e) => {
      const el = innerRef.current;
      if (el && interactive) {
        el.style.setProperty("--mo-glass-tilt", "none");
      }
      if (typeof onMouseLeave === "function") onMouseLeave(e);
    },
    [interactive, onMouseLeave]
  );

  const handlePointerDown = useCallback(
    (e) => {
      if (ripple && interactive) {
        const container = ripplesRef.current;
        if (container) {
          const r = container.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          const size = Math.max(r.width, r.height) * 1.6;
          const rip = document.createElement("span");
          rip.className = "mo-glass-ripple";
          rip.style.left = `${x}px`;
          rip.style.top = `${y}px`;
          rip.style.width = `${size}px`;
          rip.style.height = `${size}px`;
          container.appendChild(rip);
          window.setTimeout(() => {
            if (rip.parentNode === container) container.removeChild(rip);
          }, 950);
        }
      }
      if (typeof onPointerDown === "function") onPointerDown(e);
    },
    [ripple, interactive, onPointerDown]
  );

  const cls = [
    "mo-glass",
    interactive ? "mo-glass-interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      ref={setRefs}
      className={cls}
      style={style}
      onMouseMove={interactive ? handleMove : onMouseMove}
      onMouseLeave={interactive ? handleLeave : onMouseLeave}
      onPointerDown={interactive ? handlePointerDown : onPointerDown}
      {...rest}
    >
      {interactive && (
        <>
          <span className="mo-glass-sheen" aria-hidden="true" />
          <span ref={ripplesRef} className="mo-glass-ripples" aria-hidden="true" />
        </>
      )}
      <span className={`mo-glass-content ${contentClassName}`.trim()}>{children}</span>
    </Tag>
  );
});

export default GlassSurface;
