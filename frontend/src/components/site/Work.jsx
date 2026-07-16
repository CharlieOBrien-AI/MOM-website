import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GlassSurface from "@/components/glass/GlassSurface";
import Reveal from "./Reveal";
import { WORK } from "@/constants/testIds";

// Real published shorts — click a card to play it right on the page.
const items = [
  {
    id: "1IVDAVZa-YA",
    title: "The Woman Who Built ChatGPT Just Returned with Thinking Machines Lab",
    thumb: "/images/work/thumb-mira.jpg",
  },
  {
    id: "hvxb_A3Husg",
    title: "China Forced Meta to Reverse a $2 Billion Deal",
    thumb: "/images/work/thumb-zuck.jpg",
  },
  {
    id: "jt37NLgpmIQ",
    title: "The OpenAI Lawsuit Explained: Elon Musk vs Sam Altman",
    thumb: "/images/work/thumb-openai.jpg",
  },
];

function WorkCard({ it, index, isPlaying, onPlay }) {
  return (
    <GlassSurface
      data-testid={`work-card-${index}`}
      className="group block overflow-hidden rounded-2xl"
      contentClassName="absolute inset-0"
      tilt={3}
      style={{ aspectRatio: "9 / 16" }}
    >
      {isPlaying ? (
        <iframe
          data-testid={`work-iframe-${index}`}
          src={`https://www.youtube.com/embed/${it.id}?autoplay=1&playsinline=1&rel=0`}
          title={it.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          style={{ border: 0, borderRadius: "inherit", background: "#000" }}
        />
      ) : (
        <button
          type="button"
          data-testid={`work-play-${index}`}
          aria-label={`Play: ${it.title}`}
          onClick={() => onPlay(index)}
          className="absolute inset-0 block h-full w-full cursor-pointer text-left"
          style={{ border: 0, background: "transparent" }}
        >
          <img
            src={it.thumb}
            alt={it.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
            style={{ borderRadius: "inherit" }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.72) 100%)",
              borderRadius: "inherit",
            }}
          />

          <span
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border transition-transform duration-500 group-hover:scale-110"
            style={{
              borderColor: "rgba(255,255,255,0.28)",
              background: "rgba(10,10,11,0.35)",
              WebkitBackdropFilter: "blur(6px)",
              backdropFilter: "blur(6px)",
              zIndex: 4,
            }}
          >
            <span
              aria-hidden="true"
              className="ml-0.5 block h-0 w-0"
              style={{
                borderLeft: "9px solid white",
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
              }}
            />
          </span>

          <span className="absolute inset-x-5 bottom-5 block" style={{ zIndex: 4 }}>
            <span
              className="block text-white"
              style={{
                fontFamily: "Instrument Serif, serif",
                fontSize: "22px",
                lineHeight: 1.15,
                textShadow: "0 2px 12px rgba(0,0,0,0.55)",
              }}
            >
              {it.title}
            </span>
          </span>
        </button>
      )}
    </GlassSurface>
  );
}

export default function Work() {
  const total = items.length;
  const [idx, setIdx] = useState(0);
  const [playingIdx, setPlayingIdx] = useState(-1);
  const touchRef = useRef({ x: 0, y: 0 });

  const next = () => setIdx((i) => (i + 1) % total);
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const handlePlay = (i) => setPlayingIdx(i);

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

  return (
    <section
      id="work"
      data-testid={WORK.root}
      className="mx-auto max-w-[1240px] section-px py-[70px]"
    >
      <Reveal>
        <div className="mono-eyebrow mb-4">
          <span style={{ color: "var(--mo-accent)" }}>//</span> Recent work
        </div>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2
            className="text-white"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "clamp(36px, 5vw, 72px)",
              lineHeight: 1,
              letterSpacing: "-0.015em",
            }}
          >
            {"Stories we've"}{" "}
            <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
              told.
            </span>
          </h2>
          <a
            href="https://www.youtube.com/@CharlieOBrienAI/shorts"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] tracking-[0.18em] uppercase transition-colors hover:text-[var(--mo-fg)]"
            style={{
              color: "var(--mo-fg-dim)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            See all —→
          </a>
        </div>
      </Reveal>

      {/* Desktop / tablet — 3-up grid */}
      <div className="hidden grid-cols-3 gap-5 md:grid">
        {items.map((it, i) => (
          <Reveal key={it.id} delay={i * 130}>
            <WorkCard it={it} index={i} isPlaying={playingIdx === i} onPlay={handlePlay} />
          </Reveal>
        ))}
      </div>

      {/* Mobile — swipeable one-card carousel */}
      <Reveal className="md:hidden" data-testid="work-carousel">
        <div
          className="overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex"
            style={{
              width: `${total * 100}%`,
              transform: `translate3d(-${(idx * 100) / total}%, 0, 0)`,
              transition: "transform 550ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {items.map((it, i) => (
              <div
                key={it.id}
                data-testid={`work-slide-${i}`}
                className="px-1"
                style={{ width: `${100 / total}%`, flexShrink: 0 }}
              >
                <WorkCard it={it} index={i} isPlaying={playingIdx === i} onPlay={handlePlay} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div
            className="text-[11px] tracking-[0.24em] uppercase"
            data-testid="work-step-indicator"
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

          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                data-testid={`work-dot-${i}`}
                aria-label={`Go to story ${i + 1}`}
                onClick={() => setIdx(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  height: 6,
                  width: i === idx ? 24 : 6,
                  background:
                    i === idx ? "var(--mo-accent)" : "rgba(255,255,255,0.12)",
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              data-testid="work-prev"
              aria-label="Previous story"
              className="grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 hover:border-[var(--mo-accent)] hover:text-[var(--mo-accent)]"
              style={{
                borderColor: "var(--mo-line-strong)",
                color: "var(--mo-fg-dim)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <ChevronLeft size={17} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={next}
              data-testid="work-next"
              aria-label="Next story"
              className="grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 hover:border-[var(--mo-accent)] hover:text-[var(--mo-accent)]"
              style={{
                borderColor: "var(--mo-line-strong)",
                color: "var(--mo-fg-dim)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <ChevronRight size={17} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
