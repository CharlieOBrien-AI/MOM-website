import { useState } from "react";
import { FAQ } from "@/constants/testIds";

const faqs = [
  {
    q: "How long until this actually works?",
    a: "Real momentum usually shows around month three. The first few weeks are about finding your voice on camera and learning what your audience leans into. Trust compounds, it does not spike.",
  },
  {
    q: "What if I'm not comfortable on camera?",
    a: "Almost nobody is at first. We run shoots like a conversation, not a performance, and we edit around the awkward bits. Within a couple of sessions most founders forget the camera is there.",
  },
  {
    q: "How is this different from a social media manager?",
    a: "A manager posts what you give them. We build the story system, run the shoots, and own the output. You bring the expertise and the face — we handle everything between the idea and the published video.",
  },
  {
    q: "Do I still need paid ads?",
    a: "Not for this to work. Organic pull is the whole point. Plenty of clients run ads alongside, but the audience here is earned, not rented, so it keeps working when the budget stops.",
  },
  {
    q: "I've worked with an agency before and it didn't work.",
    a: "Usually because they sold content, not trust, and measured the wrong things. We start with a plan you can judge on the first call, and you can leave any month. No twelve-month lock-in.",
  },
];

function Item({ q, a, idx, open, onToggle }) {
  return (
    <div
      className="border-t"
      style={{ borderColor: "var(--mo-line)" }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        data-testid={`faq-item-${idx}`}
        className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-white"
      >
        <span
          className="text-[18px] sm:text-[22px]"
          style={{
            fontFamily: "Instrument Serif, serif",
            color: open ? "var(--mo-fg)" : "var(--mo-fg-dim)",
            transition: "color 250ms ease",
          }}
        >
          {q}
        </span>
        <span
          className="grid h-8 w-8 flex-none place-items-center rounded-full border text-[15px] transition-transform duration-300"
          style={{
            borderColor: "rgba(164,74,255,0.35)",
            color: "var(--mo-accent)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-500"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
      >
        <div className="overflow-hidden">
          <p
            className="mb-6 max-w-[640px] text-[13.5px] leading-[1.7]"
            style={{
              color: "var(--mo-fg-dim)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section
      id="faq"
      data-testid={FAQ.root}
      className="mx-auto max-w-[880px] section-px pb-[120px]"
    >
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

      <div className="mt-10">
        {faqs.map((f, i) => (
          <Item
            key={i}
            idx={i}
            {...f}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
          />
        ))}
        <div className="border-t" style={{ borderColor: "var(--mo-line)" }} />
      </div>
    </section>
  );
}
