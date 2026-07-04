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
        position: "relative",
        background: "linear-gradient(180deg, #08080a 0%, #0a0a0b 100%)",
        borderTop: "1px solid var(--mo-line)",
        borderBottom: "1px solid var(--mo-line)",
        overflow: "hidden",
      }}
    >
      {/* Leaves background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://customer-assets.emergentagent.com/job_b6a78a8c-323d-42c1-ae59-de00e052239c/artifacts/kfabpg6f_image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.55,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Dark overlay for readability */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(8,8,10,0.55) 0%, rgba(8,8,10,0.78) 60%, rgba(8,8,10,0.9) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div className="mx-auto max-w-[1240px] section-px py-[120px]" style={{ position: "relative", zIndex: 2 }}>
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
