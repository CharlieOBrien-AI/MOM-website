import { useEffect, useRef, useState } from "react";
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
      caption: "Stories told for founders who hate selling.",
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
      style={{
        background: "linear-gradient(180deg, #08080a 0%, #0a0a0b 100%)",
        borderTop: "1px solid var(--mo-line)",
        borderBottom: "1px solid var(--mo-line)",
      }}
    >
      <div className="mx-auto max-w-[1240px] section-px py-[120px]">
        <div className="mono-eyebrow mb-10">
          <span style={{ color: "var(--mo-accent)" }}>//</span> By the numbers
        </div>
        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          {items.map((it, i) => (
            <div
              key={i}
              data-testid={it.testid}
              className="border-l pl-6"
              style={{ borderColor: "rgba(164,74,255,0.35)" }}
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
                className="mt-4 max-w-[260px] text-[13px] leading-[1.6]"
                style={{
                  color: "var(--mo-fg-dim)",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {it.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
