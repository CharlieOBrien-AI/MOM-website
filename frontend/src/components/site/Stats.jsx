import { useEffect, useRef, useState } from "react";
import GlassSurface from "@/components/glass/GlassSurface";
import Reveal from "./Reveal";
import { STATS } from "@/constants/testIds";

function CountUp({ target, prefix = "", suffix = "", duration = 1400 }) {
  const [n, setN] = useState(0);
  const startedRef = useRef(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const step = (t) => {
              const p = Math.min(1, (t - start) / duration);
              // ease-out cubic
              const eased = 1 - Math.pow(1 - p, 3);
              setN(Math.round(eased * target));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return (
    <span ref={nodeRef}>
      {prefix}
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const items = [
    {
      testid: STATS.audience,
      value: <CountUp target={35000} suffix="+" />,
      caption: "Audience built organically, zero paid reach.",
    },
    {
      testid: STATS.stories,
      value: <CountUp target={300} suffix="+" />,
      caption: "Videos produced.",
    },
    {
      testid: STATS.adSpend,
      value: (
        <span>
          <CountUp target={75} suffix="%" />
          <span style={{ fontSize: "0.55em", verticalAlign: "0.35em", marginLeft: "0.08em" }}>+</span>
        </span>
      ),
      caption: "Average view duration. Stories that make people stick.",
    },
  ];

  return (
    <section
      data-testid={STATS.root}
      style={{ position: "relative", background: "transparent" }}
    >
      {/* Background is provided by the site-wide <SiteBackground /> parallax
          layer mounted on Home.jsx — this section is fully transparent so it
          floats over that single continuous nightscape. The SQ2/SQ3 bleed
          imagery that used to sit here has been removed on purpose so it
          doesn't compete with the new global background. */}
      <div className="mx-auto max-w-[1240px] section-px py-[70px]" style={{ position: "relative", zIndex: 2 }}>
        <Reveal>
          <div className="mono-eyebrow mb-10">
            <span style={{ color: "var(--mo-accent)" }}>//</span> The results speak
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 130}>
            <GlassSurface
              data-testid={it.testid}
              className="h-full rounded-2xl p-8"
              tilt={2.5}
            >
              <div
                style={{
                  fontFamily: "Instrument Serif, serif",
                  fontSize: "clamp(56px, 6vw, 92px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  color: "var(--mo-accent)",
                }}
              >
                {it.value}
              </div>
              <div
                className="mt-4 max-w-[280px] text-[13px] leading-[1.6]"
                style={{
                  color: "var(--mo-fg-dim)",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {it.caption}
              </div>
            </GlassSurface>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
