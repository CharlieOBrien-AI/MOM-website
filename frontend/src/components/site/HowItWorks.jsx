import { PROCESS } from "@/constants/testIds";

const steps = [
  { n: "01", title: "Discovery", body: "We get into your world and find the angles worth filming." },
  { n: "02", title: "Angles", body: "A backlog of story ideas, ranked by what will land." },
  { n: "03", title: "Scripting", body: "Loose enough to sound like you, tight enough to hold a hook." },
  { n: "04", title: "Filming", body: "One relaxed shoot day a month. We bring the kit and the calm." },
  { n: "05", title: "Edit", body: "Captions, pacing, sound. The work that wins watch time." },
  { n: "06", title: "Publish", body: "Posted on a rhythm, native to each platform." },
  { n: "07", title: "Iterate", body: "We read the numbers and double down on the pull." },
];

export default function HowItWorks() {
  return (
    <section
      data-testid={PROCESS.root}
      style={{
        background: "linear-gradient(180deg, #08080a, #0a0a0b)",
        borderTop: "1px solid var(--mo-line)",
        borderBottom: "1px solid var(--mo-line)",
      }}
    >
      <div className="mx-auto max-w-[1240px] px-6 py-[120px] sm:px-8">
        <div className="mono-eyebrow mb-4">
          <span style={{ color: "var(--mo-accent)" }}>//</span> How it works
        </div>
        <h2
          className="text-white"
          style={{
            fontFamily: "Instrument Serif, serif",
            fontSize: "clamp(36px, 5vw, 68px)",
            lineHeight: 1,
            letterSpacing: "-0.015em",
          }}
        >
          {"So here's how we"}{" "}
          <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
            fix it.
          </span>
        </h2>
        <p
          className="mt-5 max-w-[560px] text-[14px] leading-[1.7]"
          style={{
            color: "var(--mo-fg-dim)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {"From your first call to a feed that compounds — here's exactly how we work."}
        </p>

        <div
          className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border md:grid-cols-4"
          style={{
            borderColor: "var(--mo-line)",
            background: "var(--mo-line)",
          }}
        >
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="group relative min-h-[180px] p-7 transition-colors duration-300"
              style={{
                background: i === 0 ? "rgba(212,162,86,0.05)" : "#0a0a0b",
              }}
            >
              <div
                className="text-[12px] tracking-[0.18em]"
                style={{
                  color: i === 0 ? "var(--mo-accent)" : "var(--mo-mute)",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {s.n}
              </div>
              <div
                className="mt-4 text-white"
                style={{
                  fontFamily: "Instrument Serif, serif",
                  fontSize: "24px",
                  lineHeight: 1.1,
                }}
              >
                {s.title}
              </div>
              <div
                className="mt-2 text-[12.5px] leading-[1.55]"
                style={{
                  color: "var(--mo-fg-dim)",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {s.body}
              </div>
            </div>
          ))}
          <div className="flex min-h-[180px] items-end bg-[#050506] p-7">
            <a
              href="#contact"
              className="text-[11px] tracking-[0.18em] uppercase transition-colors hover:text-[var(--mo-accent-strong)]"
              style={{
                color: "var(--mo-accent)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              See the full
              <br />
              process →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
