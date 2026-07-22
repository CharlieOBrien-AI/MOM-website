import { useEffect, useRef, useState } from "react";
import {
  Binoculars,
  PenTool,
  Clapperboard,
  Scissors,
  Send,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Reveal from "./Reveal";
import ParallaxBackground from "./ParallaxBackground";
import { PROCESS } from "@/constants/testIds";

const steps = [
  {
    title: "Audience Research",
    desc: "We dive into your world and your audience's. What they watch, what they skip, and what they already care about.",
    icon: Binoculars,
    detailLabel: "We learn from your audience",
    bullets: ["Competitor research", "Audience psychology", "Topic validation"],
  },
  {
    title: "Story Development",
    desc: "Those insights become ideas people actually want to watch — angles, hooks and scripts built to hold attention.",
    icon: PenTool,
    detailLabel: "We shape the story",
    bullets: ["Content angles", "Curiosity hooks", "Scripts"],
  },
  {
    title: "Production",
    desc: "We run the shoot like a conversation, not a performance, and capture content that feels authentic.",
    icon: Clapperboard,
    detailLabel: "We film it with you",
    bullets: ["Creative direction", "Filming", "Footage review"],
  },
  {
    title: "Retention Editing",
    desc: "Every cut is made for one thing: keeping people watching until the very last second.",
    icon: Scissors,
    detailLabel: "We make it un-skippable",
    bullets: ["Story pacing", "Motion & subtitles", "Sound design"],
  },
  {
    title: "Distribution",
    desc: "Each video is optimized and published where your audience already spends their time.",
    icon: Send,
    detailLabel: "We put it in front of the right people",
    bullets: [
      "Multi-platform publishing",
      "Platform optimization",
      "Performance tracking",
    ],
  },
  {
    title: "Trust",
    desc: "Attention compounds into familiarity. Familiarity becomes trust. Trust becomes customers.",
    icon: HeartHandshake,
    detailLabel: "We turn views into buyers",
    bullets: ["Retarget warm audiences", "Double down on what works", "Repeat"],
  },
];

function StepRow({ step, index, open, onToggle }) {
  const Icon = step.icon;
  return (
    <div data-testid={`process-step-${index}`} className="pt-2 text-center">
      <div className="flex flex-col items-center gap-6">
        {/* Icon (centered on top for balance) */}
        <div aria-hidden="true">
          <Icon size={72} strokeWidth={0.9} color="rgba(255,255,255,0.9)" />
        </div>

        {/* (Step n) */}
        <div
          className="text-[12px] tracking-[0.1em]"
          style={{
            color: "var(--mo-fg-dim)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          (Step {index + 1})
        </div>

        {/* Big title */}
        <h3
          className="text-white"
          style={{
            fontFamily: "Instrument Serif, serif",
            fontSize: "clamp(34px, 3.4vw, 52px)",
            letterSpacing: "-0.015em",
            lineHeight: 1.02,
          }}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p
          className="mx-auto max-w-[640px] text-[15px] leading-[1.8]"
          style={{
            color: "var(--mo-fg)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {step.desc}
        </p>
      </div>

      {/* Expandable detail row */}
      <div className="mx-auto mt-10 max-w-[720px] text-left">
        <div className="border-t" style={{ borderColor: "var(--mo-line)" }}>
          <button
            type="button"
            data-testid={`process-accordion-${index}`}
            aria-expanded={open}
            onClick={onToggle}
            className="mo-press flex w-full items-center justify-between gap-6 py-5 text-left"
          >
            <span
              className="text-[18px] sm:text-[21px]"
              style={{
                fontFamily: "Instrument Serif, serif",
                color: open ? "var(--mo-fg)" : "var(--mo-fg-dim)",
                transition: "color 220ms ease",
              }}
            >
              {step.detailLabel}
            </span>
            <span
              className="grid h-9 w-9 flex-none place-items-center rounded-full border text-[16px]"
              style={{
                borderColor: "rgba(164,74,255,0.35)",
                color: "var(--mo-accent)",
                transform: open ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 260ms var(--ease-out-strong)",
              }}
            >
              +
            </span>
          </button>

          <div
            className="grid"
            style={{
              gridTemplateRows: open ? "1fr" : "0fr",
              transition: "grid-template-rows 420ms var(--ease-out-strong)",
            }}
          >
            <div className="overflow-hidden">
              <ul
                className="mb-4 space-y-3"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(-6px)",
                  transition: open
                    ? "opacity 260ms ease 140ms, transform 320ms var(--ease-out-strong) 140ms"
                    : "opacity 140ms ease, transform 200ms var(--ease-out-strong)",
                }}
              >
                {step.bullets.map((b) => (
                  <li
                    key={b}
                    className="text-[13.5px] leading-[1.6]"
                    style={{
                      color: "var(--mo-fg-dim)",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    <span style={{ color: "var(--mo-accent)" }}>•</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const total = steps.length;
  const [idx, setIdx] = useState(0);
  const [openIdx, setOpenIdx] = useState(-1);
  const trackRef = useRef(null);

  const next = () => setIdx((i) => (i + 1) % total);
  const prev = () => setIdx((i) => (i - 1 + total) % total);

  const touchRef = useRef({ x: 0, y: 0 });
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

  // Keyboard support when the section is in view
  useEffect(() => {
    const onKey = (e) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight * 0.75 &&
        rect.bottom > window.innerHeight * 0.25;
      if (!inView) return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <section
      data-testid={PROCESS.root}
      className="relative overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Section-level nightscape (bg-4) with slow parallax + linear tint,
          matching the treatment on FAQ and Voices. */}
      <ParallaxBackground
        src="/images/bg/bg-4.webp"
        speed={0.14}
        tint="linear-gradient(180deg, rgba(6,4,14,0.82) 0%, rgba(6,4,14,0.55) 45%, rgba(6,4,14,0.88) 100%)"
      />
      <div className="relative mx-auto max-w-[1240px] section-px py-[70px] text-center">
        <Reveal>
          <div className="mono-eyebrow mb-4">
            <span style={{ color: "var(--mo-accent)" }}>//</span> How it works
          </div>

          <h2
            className="mx-auto text-white"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "clamp(36px, 5vw, 68px)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              maxWidth: "900px",
            }}
          >
            {"How We Create Content That"}{" "}
            <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
              Pulls People In.
            </span>
          </h2>

          <div
            className="mt-6 text-[11px] tracking-[0.24em] uppercase"
            data-testid="process-step-indicator"
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
        </Reveal>

        {/* One step at a time — arrows on the sides + swipe / keyboard reveal the next */}
        <Reveal delay={130}>
          <div className="relative mt-12">
            {/* Left arrow */}
            <button
              type="button"
              onClick={prev}
              data-testid="process-prev"
              data-base
              aria-label="Previous step"
              className="mo-press absolute left-0 top-1/2 z-10 grid h-11 w-11 place-items-center rounded-full border transition-[border-color,color] duration-200 ease-out hover:border-[var(--mo-accent)] hover:text-[var(--mo-accent)] sm:h-12 sm:w-12 md:left-2 lg:left-4"
              style={{
                borderColor: "var(--mo-line-strong)",
                color: "var(--mo-fg-dim)",
                background: "rgba(0,0,0,0.35)",
                WebkitBackdropFilter: "blur(6px)",
                backdropFilter: "blur(6px)",
                transform: "translateY(-50%)",
                "--mo-press-base": "translateY(-50%)",
              }}
            >
              <ChevronLeft size={20} strokeWidth={1.6} />
            </button>

            {/* Right arrow */}
            <button
              type="button"
              onClick={next}
              data-testid="process-next"
              data-base
              aria-label="Next step"
              className="mo-press absolute right-0 top-1/2 z-10 grid h-11 w-11 place-items-center rounded-full border transition-[border-color,color] duration-200 ease-out hover:border-[var(--mo-accent)] hover:text-[var(--mo-accent)] sm:h-12 sm:w-12 md:right-2 lg:right-4"
              style={{
                borderColor: "var(--mo-line-strong)",
                color: "var(--mo-fg-dim)",
                background: "rgba(0,0,0,0.35)",
                WebkitBackdropFilter: "blur(6px)",
                backdropFilter: "blur(6px)",
                transform: "translateY(-50%)",
                "--mo-press-base": "translateY(-50%)",
              }}
            >
              <ChevronRight size={20} strokeWidth={1.6} />
            </button>

            {/* Carousel content, padded so arrows never overlap text */}
            <div
              ref={trackRef}
              className="overflow-hidden border-t px-14 sm:px-16 md:px-20"
              style={{ borderColor: "var(--mo-line)" }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex"
                style={{
                  width: `${total * 100}%`,
                  transform: `translate3d(-${(idx * 100) / total}%, 0, 0)`,
                  transition: "transform 500ms var(--ease-out-strong)",
                }}
              >
                {steps.map((s, i) => (
                  <div
                    key={s.title}
                    className="py-10 lg:py-12"
                    style={{ width: `${100 / total}%`, flexShrink: 0 }}
                  >
                    <StepRow
                      step={s}
                      index={i}
                      open={openIdx === i}
                      onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                data-testid={`process-dot-${i}`}
                aria-label={`Go to step ${i + 1}`}
                onClick={() => setIdx(i)}
                className="mo-press rounded-full"
                style={{
                  height: 6,
                  width: i === idx ? 24 : 6,
                  background:
                    i === idx ? "var(--mo-accent)" : "rgba(255,255,255,0.12)",
                  transition:
                    "width 260ms var(--ease-out-strong), background-color 260ms ease",
                }}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
