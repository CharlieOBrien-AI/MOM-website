import { VOICES } from "@/constants/testIds";

const voices = [
  { initials: "DO", name: "Dana Okafor", handle: "@dana.builds", quote: "I have watched every single one. Genuinely the only business account I do not skip." },
  { initials: "MH", name: "Marcus Heng", handle: "@marcusheng", quote: "Sent this to my whole team. The hiring one hit way too close to home." },
  { initials: "PR", name: "Priya Raman", handle: "@priya.r", quote: "Found you three weeks ago, now I am a customer. That is the whole funnel right there." },
  { initials: "TV", name: "Theo Vance", handle: "@theovance", quote: "This is the first founder content that does not make me cringe. How." },
  { initials: "LB", name: "Lena Brandt", handle: "@lenabuilds", quote: "You explained in 40 seconds what my last agency could not in a 30-slide deck." },
  { initials: "SO", name: "Sam Okonkwo", handle: "@sokonkwo", quote: "Stop reading the comments and go book them. That is my review." },
];

export default function Voices() {
  return (
    <section
      data-testid={VOICES.root}
      style={{
        background:
          "radial-gradient(120% 60% at 50% 0%, rgba(164,74,255,0.05), rgba(10,10,11,0) 55%), linear-gradient(180deg, #08080a 0%, #0a0a0b 100%)",
        borderTop: "1px solid var(--mo-line)",
        borderBottom: "1px solid var(--mo-line)",
      }}
    >
      <div className="mx-auto max-w-[1240px] section-px py-[120px] text-center">
        <div className="mono-eyebrow mb-4">
          <span style={{ color: "var(--mo-accent)" }}>//</span> What people say
        </div>
        <h2
          className="mx-auto max-w-[680px] text-white"
          style={{
            fontFamily: "Instrument Serif, serif",
            fontSize: "clamp(36px, 5vw, 68px)",
            lineHeight: 1.02,
            letterSpacing: "-0.015em",
          }}
        >
          {"People can buy followers. They can't buy"}{" "}
          <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
            this.
          </span>
        </h2>

        <div className="mt-12 grid gap-4 text-left md:grid-cols-2 lg:grid-cols-3">
        {voices.map((v) => (
          <div
            key={v.name}
            className="rounded-2xl border p-6 transition-transform duration-500 hover:-translate-y-0.5"
            style={{
              borderColor: "var(--mo-line)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="grid h-9 w-9 flex-none place-items-center rounded-full border"
                style={{
                  borderColor: "rgba(164,74,255,0.35)",
                  background: "rgba(164,74,255,0.08)",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  color: "var(--mo-accent-strong)",
                }}
              >
                {v.initials}
              </div>
              <div>
                <div
                  className="text-[13px]"
                  style={{
                    color: "var(--mo-fg)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {v.name}
                </div>
                <div
                  className="text-[10px] tracking-[0.14em]"
                  style={{
                    color: "var(--mo-mute)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {v.handle}
                </div>
              </div>
            </div>
            <p
              className="mt-4 text-[14px] leading-[1.65]"
              style={{
                color: "var(--mo-fg-dim)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {`"${v.quote}"`}
            </p>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}
