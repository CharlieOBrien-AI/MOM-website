import { CONTACT } from "@/constants/testIds";

export default function Contact() {
  return (
    <section
      id="contact"
      data-testid={CONTACT.root}
      className="relative overflow-hidden"
    >
      <div className="mx-auto max-w-[1240px] px-6 pb-[120px] sm:px-8">
        <div
          className="relative overflow-hidden rounded-3xl border p-[clamp(56px,8vw,120px)_40px] text-center"
          style={{
            borderColor: "rgba(212,162,86,0.24)",
            background:
              "radial-gradient(120% 100% at 50% 0%, rgba(212,162,86,0.10), rgba(10,10,11,0) 60%), linear-gradient(180deg, #0a0a0b, #08080a)",
          }}
        >
          <div className="noise-overlay" aria-hidden="true" />

          <div className="relative flex justify-center gap-6">
            {[0, 1].map((i) => (
              <div
                key={i}
                aria-hidden="true"
                className="grid h-9 w-9 place-items-center rounded-full border"
                style={{
                  borderColor: "var(--mo-accent-warm)",
                  animation: `mo-eyepulse 2.6s ease ${i * 0.3}s infinite`,
                }}
              >
                <div
                  className="h-3.5 w-3.5 rounded-full"
                  style={{
                    background: "var(--mo-accent-warm)",
                    boxShadow: "0 0 20px var(--mo-accent-warm)",
                  }}
                />
              </div>
            ))}
          </div>

          <style>{`
            @keyframes mo-eyepulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(0.86); opacity: 0.55; }
            }
          `}</style>

          <h2
            className="relative mx-auto mt-8 max-w-[840px] text-white"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "clamp(44px, 6vw, 92px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {"Let's tell some"}{" "}
            <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
              stories.
            </span>
          </h2>

          <p
            className="relative mx-auto mt-8 max-w-[520px] text-[14.5px] leading-[1.7]"
            style={{
              color: "var(--mo-fg-dim)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            Book a free consultation session with us.
          </p>

          <a
            href="mailto:hello@midnightowl.media"
            data-testid={CONTACT.cta}
            className="group relative mt-10 inline-flex items-center gap-2 rounded-full px-8 py-4 text-[12px] font-medium tracking-[0.18em] uppercase transition-transform duration-300 hover:-translate-y-0.5"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              background: "var(--mo-fg)",
              color: "var(--mo-bg)",
              boxShadow:
                "0 20px 60px -18px rgba(164,74,255,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            Book a call
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
