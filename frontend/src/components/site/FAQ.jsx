import { useState } from "react";
import GlassSurface from "@/components/glass/GlassSurface";
import Reveal from "./Reveal";
import { FAQ } from "@/constants/testIds";

const faqs = [
  {
    q: "What does Midnight Owl actually do?",
    a: [
      "We make videos people actually want to watch.",
      "Most brands push their product and get scrolled past. We do it differently.",
      "We start with content that genuinely helps or entertains your audience, so they get familiar with you first.",
      "Once they know and like you, your product shows up as the natural next step, not a sales pitch, and that is when they actually buy.",
    ],
  },
  {
    q: "Why pick you over another agency?",
    a: [
      "Most agencies sell convenience. We sell recall.",
      "They will post your videos and keep you active, but that does not mean people actually start buying from you.",
      "We take someone who has never heard of you and turn them into someone who picks you every time.",
      "Getting seen is easy. Getting chosen is the hard part.",
    ],
  },
  {
    q: "How soon will I see results?",
    a: [
      "You will see things move in the first few weeks. The bigger payoff builds after that.",
      "Rented attention like ads disappears the moment you stop paying.",
      "What we build is yours, and people keep coming back even when we are not actively pushing that week.",
    ],
  },
  {
    q: "Do I have to be on camera?",
    a: [
      "No, not unless you want to.",
      "If you are building a personal brand, we will make good use of your face on camera.",
      "If you are busy or not comfortable filming, we can build an AI version of you, or bring in a presenter instead.",
    ],
  },
  {
    q: "How much does it cost?",
    a: [
      "What it takes to reach your audience is different for every brand.",
      "So we talk first, figure out what you actually need, and quote you something fair, instead of throwing a random number at you.",
    ],
  },
];

function Item({ q, a, idx, open, onToggle }) {
  return (
    <GlassSurface
      className="rounded-2xl mb-3"
      interactive={true}
      tilt={1.5}
      onPointerDown={onToggle}
    >
      <button
        type="button"
        aria-expanded={open}
        data-testid={`faq-item-${idx}`}
        className="mo-press flex w-full items-center justify-between gap-6 px-6 py-6 text-left transition-colors duration-200 hover:text-white"
      >
        <span
          className="text-[18px] sm:text-[22px]"
          style={{
            fontFamily: "Instrument Serif, serif",
            color: open ? "var(--mo-fg)" : "var(--mo-fg-dim)",
            transition: "color 220ms ease",
          }}
        >
          {q}
        </span>
        <span
          className="grid h-8 w-8 flex-none place-items-center rounded-full border text-[15px] transition-transform duration-220"
          style={{
            borderColor: "rgba(164,74,255,0.35)",
            color: "var(--mo-accent)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 220ms var(--ease-out-strong)",
          }}
        >
          +
        </span>
      </button>

      <div
        className="grid px-6"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 420ms var(--ease-out-strong)",
        }}
      >
        <div className="overflow-hidden">
          <div
            className="mb-6 max-w-[640px] space-y-3"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(-6px)",
              transition: open
                ? "opacity 260ms ease 140ms, transform 320ms var(--ease-out-strong) 140ms"
                : "opacity 140ms ease, transform 200ms var(--ease-out-strong)",
            }}
          >
            {a.map((line, i) => (
              <p
                key={i}
                className="text-[13.5px] leading-[1.7]"
                style={{
                  color: "var(--mo-fg-dim)",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </GlassSurface>
  );
}

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(-1);

  return (
    <section
      id="faq"
      data-testid={FAQ.root}
      className="mx-auto max-w-[880px] section-px py-[70px]"
    >
      <Reveal>
      <div className="mono-eyebrow mb-4">
        <span style={{ color: "var(--mo-accent)" }}>//</span> FAQ
      </div>
      <h2
        className="text-white"
        style={{
          fontFamily: "Instrument Serif, serif",
          fontSize: "clamp(30px, 3.6vw, 52px)",
          letterSpacing: "-0.015em",
          lineHeight: 1.1,
        }}
      >
        {"The questions you're"}{" "}
        <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
          thinking.
        </span>
      </h2>
      </Reveal>

      <div className="mt-10">
        {faqs.map((f, i) => (
          <Reveal key={i} delay={i * 70}>
            <Item
              idx={i}
              {...f}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
