import GlassSurface from "@/components/glass/GlassSurface";
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

export default function Work() {
  return (
    <section
      id="work"
      data-testid={WORK.root}
      className="mx-auto max-w-[1240px] section-px pb-[120px]"
    >
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

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((it, i) => (
          <GlassSurface
            key={i}
            as="a"
            href="#contact"
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
        ))}
      </div>
    </section>
  );
}
