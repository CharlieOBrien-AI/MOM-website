import { useEffect, useRef, useState } from "react";
import { APPROACH } from "@/constants/testIds";

/**
 * PremiumToggle — Push / Pull segmented switch
 * - Sliding pill indicator
 * - 300ms ease-in-out
 * - Keyboard accessible (Arrow, Home/End, Space/Enter)
 * - Focus visible
 */
export default function PremiumToggle({ value, onChange, disabled = false }) {
  const containerRef = useRef(null);
  const pushRef = useRef(null);
  const pullRef = useRef(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const measure = () => {
      const target = value === "push" ? pushRef.current : pullRef.current;
      const container = containerRef.current;
      if (!target || !container) return;
      const cRect = container.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      setPill({ left: tRect.left - cRect.left, width: tRect.width });
    };
    measure();
    window.addEventListener("resize", measure);
    // Re-measure once fonts are ready (Instrument Serif + JB Mono width)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    return () => window.removeEventListener("resize", measure);
  }, [value]);

  const onKeyDown = (e) => {
    if (disabled) return;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      // Pull is now on the LEFT (default), Push on the RIGHT.
      if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "Home") onChange("pull");
      else onChange("push");
    }
  };

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label="Content mode"
      data-testid={APPROACH.toggleGroup}
      onKeyDown={onKeyDown}
      className="relative inline-flex items-center gap-0 rounded-full border p-1 select-none"
      style={{
        borderColor: "var(--mo-line-strong)",
        background: "rgba(255,255,255,0.03)",
        WebkitBackdropFilter: "blur(10px)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Sliding pill */}
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 rounded-full"
        style={{
          left: pill.left,
          width: pill.width,
          background: "var(--mo-fg)",
          transition:
            "left 320ms var(--ease-out-strong), width 320ms var(--ease-out-strong), box-shadow 320ms ease",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.05), 0 8px 24px -8px rgba(164,74,255,0.35), 0 0 32px -8px rgba(164,74,255,0.25)",
        }}
      />

      {/* Pull is now on the LEFT — it's the default mode. */}
      <button
        ref={pullRef}
        type="button"
        role="radio"
        aria-checked={value === "pull"}
        data-testid={APPROACH.togglePull}
        tabIndex={value === "pull" ? 0 : -1}
        onClick={() => !disabled && onChange("pull")}
        disabled={disabled}
        className="mo-press relative z-10 rounded-full px-8 py-3 text-[12.5px] font-medium tracking-[0.22em] uppercase transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--mo-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mo-bg)]"
        style={{
          color: value === "pull" ? "var(--mo-bg)" : "var(--mo-fg-dim)",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        Pull
      </button>
      <button
        ref={pushRef}
        type="button"
        role="radio"
        aria-checked={value === "push"}
        data-testid={APPROACH.togglePush}
        tabIndex={value === "push" ? 0 : -1}
        onClick={() => !disabled && onChange("push")}
        disabled={disabled}
        className="mo-press relative z-10 rounded-full px-8 py-3 text-[12.5px] font-medium tracking-[0.22em] uppercase transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--mo-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mo-bg)]"
        style={{
          color: value === "push" ? "var(--mo-bg)" : "var(--mo-fg-dim)",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        Push
      </button>
    </div>
  );
}
