import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GlassSurface from "@/components/glass/GlassSurface";
import Reveal from "./Reveal";
import { WORK } from "@/constants/testIds";

const items = [
  {
    title: "The $40k hiring mistake",
    kicker: "Founder story",
    hue: "linear-gradient(155deg, rgba(26,20,16,0.55) 0%, rgba(10,10,11,0.35) 70%)",
    accent: "#c48a44",
  },
  {
    title: "Why we killed our best feature",
    kicker: "Behind the scenes",
    hue: "linear-gradient(155deg, rgba(16,20,24,0.55) 0%, rgba(10,10,11,0.35) 70%)",
    accent: "#7fa1c0",
  },
  {
    title: "What I wish I knew at year one",
    kicker: "Lessons",
    hue: "linear-gradient(155deg, rgba(21,16,15,0.55) 0%, rgba(10,10,11,0.35) 70%)",
    accent: "#d4a256",
  },
];

function WorkCard({ it, index }) {
  return (
    <GlassSurface
      as="a"
      href="#contact"
      data-testid={`work-card-${index}`}
      className="group block rounded-2xl"
      contentClassName="absolute inset-0"
      tilt={4}
      style={{ aspectRatio: "9 / 13" }}
    >
      {/* Colored inner wash so each tile has its own hue over the glass */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: it.hue, borderRadius: "inherit" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-80 transition-transform duration-[900ms] ease-out group-hover:scale-105"
        style={{
          background: `radial-gradient(80% 60% at 50% 30%, ${it.accent}33, transparent 70%)`,
          borderRadius: "inherit",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)",
          borderRadius: "inherit",
        }}
      />

      <div
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border transition-transform duration-500 group-hover:scale-110"
        style={{
          borderColor: "rgba(255,255,255,0.28)",
          background: "rgba(10,10,11,0.35)",
          WebkitBackdropFilter: "blur(6px)",
          backdropFilter: "blur(6px)",
          zIndex: 4,
        }}
      >
        <span
          aria-hidden="true"
          className="ml-0.5 block h-0 w-0"
          style={{
            borderLeft: "9px solid white",
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
          }}
        />
      </div>

      <div className="absolute inset-x-5 bottom-5" style={{ zIndex: 4 }}>
        <div
          className="text-white"
          style={{
            fontFamily: "Instrument Serif, serif",
            fontSize: "26px",
            lineHeight: 1.1,
          }}
        >
          {it.title}
        </div>
        <div
          className="mt-2 text-[11px] tracking-[0.18em] uppercase"
          style={{
            color: "var(--mo-fg-dim)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {it.kicker}
        </div>
      </div>
    </GlassSurface>
  );
}

export default function Work() {
  const total = items.length;
  const [idx, setIdx] = useState(0);
  const touchRef = useRef({ x: 0, y: 0 });

  const next = () => setIdx((i) => (i + 1) % total);
  const prev = () => setIdx((i) => (i - 1 + total) % total);

  const onTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };
  const onTouchEnd = (e) => {
    const t = e.changedTouches && e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  };

  return (
    <section
      id="work"
      data-testid={WORK.root}
      className="mx-auto max-w-[1240px] section-px pb-[120px]"
    >
      <Reveal>
        <div className="mono-eyebrow mb-4">
          <span style={{ color: "var(--mo-accent)" }}>//</span> Recent work
        </div>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2
            className="text-white"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "clamp(36px, 5vw, 72px)",
              lineHeight: 1,
              letterSpacing: "-0.015em",
            }}
          >
            {"Stories we've"}{" "}
            <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
              told.
            </span>
          </h2>
          <a
            href="#contact"
            className="text-[11px] tracking-[0.18em] uppercase transition-colors hover:text-[var(--mo-fg)]"
            style={{
              color: "var(--mo-fg-dim)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            See all —→
          </a>
        </div>
      </Reveal>

      {/* Desktop / tablet — 3-up grid */}
      <div className="hidden grid-cols-3 gap-5 md:grid">
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 130}>
            <WorkCard it={it} index={i} />
          </Reveal>
        ))}
      </div>

      {/* Mobile — swipeable one-card carousel (same pattern as How it works) */}
      <Reveal className="md:hidden" data-testid="work-carousel">
        <div
          className="overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex"
            style={{
              width: `${total * 100}%`,
              transform: `translate3d(-${(idx * 100) / total}%, 0, 0)`,
              transition: "transform 550ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {items.map((it, i) => (
              <div
                key={i}
                data-testid={`work-slide-${i}`}
                className="px-1"
                style={{ width: `${100 / total}%`, flexShrink: 0 }}
              >
                <WorkCard it={it} index={i} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div
            className="text-[11px] tracking-[0.24em] uppercase"
            data-testid="work-step-indicator"
            style={{
              color: "var(--mo-fg-dim)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            <span style={{ color: "var(--mo-accent)" }}>
              {String(idx + 1).padStart(2, "0")}
            </span>
            {" / "}
            {String(total).padStart(2, "0")}
          </div>

          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                data-testid={`work-dot-${i}`}
                aria-label={`Go to story ${i + 1}`}
                onClick={() => setIdx(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  height: 6,
                  width: i === idx ? 24 : 6,
                  background:
                    i === idx ? "var(--mo-accent)" : "rgba(255,255,255,0.12)",
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              data-testid="work-prev"
              aria-label="Previous story"
              className="grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 hover:border-[var(--mo-accent)] hover:text-[var(--mo-accent)]"
              style={{
                borderColor: "var(--mo-line-strong)",
                color: "var(--mo-fg-dim)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <ChevronLeft size={17} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={next}
              data-testid="work-next"
              aria-label="Next story"
              className="grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 hover:border-[var(--mo-accent)] hover:text-[var(--mo-accent)]"
              style={{
                borderColor: "var(--mo-line-strong)",
                color: "var(--mo-fg-dim)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <ChevronRight size={17} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
