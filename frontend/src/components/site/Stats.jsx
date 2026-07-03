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
  const [featured, ...rest] = items;

  return (
    <section
      data-testid={STATS.root}
      className="mx-auto max-w-[1240px] section-px py-[90px] sm:py-[100px]"
    >
      <div className="mono-eyebrow mb-10">
        <span style={{ color: "var(--mo-accent)" }}>//</span> By the numbers
      </div>

      {/* Asymmetric split — one oversized anchor stat + a stacked, offset list */}
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-6">
        <div data-testid={featured.testid} className="lg:col-span-5">
          <div
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "clamp(64px, 11vw, 176px)",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              color: "var(--mo-accent)",
            }}
          >
            {featured.value}
          </div>
          <div
            className="mt-5 max-w-[280px] border-l pl-5 text-[13px] leading-[1.6]"
            style={{
              borderColor: "rgba(164,74,255,0.35)",
              color: "var(--mo-fg-dim)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {featured.caption}
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-10 lg:pt-24">
          {rest.map((it, i) => (
            <div
              key={i}
              data-testid={it.testid}
              className="flex flex-col gap-3 border-t py-7 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
              style={{ borderColor: "var(--mo-line)" }}
            >
              <div
                style={{
                  fontFamily: "Instrument Serif, serif",
                  fontSize: "clamp(40px, 4.4vw, 60px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  color: "var(--mo-fg)",
                }}
              >
                {it.value}
              </div>
              <div
                className="max-w-[300px] text-[13px] leading-[1.6] sm:text-right"
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
