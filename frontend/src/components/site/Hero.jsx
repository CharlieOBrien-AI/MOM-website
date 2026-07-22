import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroScrubVideo from "./HeroScrubVideo";
import TextRotator from "./TextRotator";
import GlassSurface from "@/components/glass/GlassSurface";
import { HERO } from "@/constants/testIds";

export default function Hero() {
  // Headline choreography: "30 videos a month" starts pure white with no
  // strikethrough and nothing below it; after ~3.5s the strike draws in,
  // the text dims to grey and the rotator line fades up.
  const [struck, setStruck] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStruck(true), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="top"
      data-testid={HERO.root}
      // `min-h-[100svh]` uses the *small* viewport height (Chrome ≥108,
      // Safari ≥15.4). On Android, plain `100vh` refers to the viewport
      // with the URL bar HIDDEN — so on first load, when the URL bar is
      // still showing, content near the bottom of a `min-h-screen` hero
      // gets pushed below the fold. svh is always the smallest possible
      // viewport height (URL bar + all UI shown), so the CTAs are
      // guaranteed to be visible on first paint. Desktop keeps `lg:min-h-screen`
      // for the full-bleed cinematic view.
      className="relative flex h-full min-h-[100svh] lg:min-h-screen flex-col overflow-hidden pt-[68px] lg:justify-center lg:pt-0"
    >
      {/* Desktop-only full-bleed video layer — spans the entire hero so the
          cursor-driven scrub maps 1:1 with pointer X. Hidden on mobile
          because the owl scene reads awkwardly when squeezed into a
          portrait viewport; mobile gets a contained box above the copy
          instead (see below). */}
      <div className="absolute inset-0 hidden lg:block">
        <HeroScrubVideo />
      </div>

      {/* Content — explicit z-index keeps the copy above the video layers.
          Mobile paddings are trimmed (py-4 not py-10) so the whole hero fits
          within a phone's visible viewport including CTAs. */}
      <div className="relative z-10 mx-auto w-full max-w-[1240px] section-px py-4 lg:py-0 lg:pt-24">
        {/* MOBILE: owl in a contained rounded box above the text. Mirrors
            the "media panel + copy stacked" pattern the Approach section
            uses on small screens, so the whole page reads with a
            consistent rhythm. Auto-hidden on lg+ where the full-bleed
            video takes over.

            Aspect ratio is 16/10 (was 5/4) so the box is shorter — this
            leaves room below for the eyebrow + headline + copy + BOTH
            CTA buttons within a single Android viewport-with-URL-bar. */}
        <div
          className="lg:hidden mb-3 mx-auto"
          data-testid="hero-mobile-media"
          style={{ maxWidth: "480px" }}
        >
          <div
            className="relative w-full overflow-hidden rounded-2xl border"
            style={{
              aspectRatio: "16 / 9",
              borderColor: "var(--mo-line)",
              background: "var(--mo-bg-elev)",
            }}
          >
            {/* HeroScrubVideo positions itself with `absolute inset-0`
                inside its parent, so wrapping it here scales the video
                to fill the contained box neatly. On mobile the component
                renders <MobileHeroVideo /> which autoplays looped —
                perfect for a decorative panel. */}
            <HeroScrubVideo />
          </div>
        </div>

        <div className="max-w-[880px] stagger">
          <div className="mono-eyebrow" data-testid="hero-eyebrow">
            <span style={{ color: "var(--mo-accent)" }}>//</span> Storytelling-first content studio
          </div>

          <h1
            data-testid={HERO.headline}
            className="mt-6 sm:mt-8 text-white"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "clamp(34px, 6.2vw, 96px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              fontWeight: 400,
            }}
          >
            We help you build{" "}
            <span
              className="relative whitespace-nowrap"
              style={{
                color: struck ? "var(--mo-mute)" : "#ffffff",
                transition: "color 900ms ease",
              }}
            >
              <span style={{ fontStyle: "italic" }}>30 videos a month</span>
              <span
                aria-hidden="true"
                data-testid="hero-strike"
                className="absolute left-0 top-[54%] block"
                style={{
                  height: "3px",
                  width: struck ? "100%" : "0%",
                  background: "var(--mo-accent-warm)",
                  transition: "width 900ms cubic-bezier(0.65, 0, 0.35, 1)",
                }}
              />
            </span>
            <br />
            <span
              data-testid="hero-rotator-line"
              style={{
                opacity: struck ? 1 : 0,
                transition: "opacity 800ms ease 350ms",
              }}
            >
              <TextRotator
                words={["trust.", "loyalty.", "a community."]}
                active={struck}
                style={{ color: "var(--mo-accent)", fontStyle: "italic" }}
              />
            </span>
          </h1>

          <p
            data-testid={HERO.copy}
            className="mt-4 sm:mt-8 max-w-[560px] text-[14.5px] leading-[1.7]"
            style={{
              color: "var(--mo-fg-dim)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            We make videos that make people{" "}
            <span style={{ color: "var(--mo-accent)" }}>care</span>.
          </p>

          <div className="mt-5 sm:mt-10 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <GlassSurface
              as={Link}
              to="/brief"
              data-testid={HERO.ctaPrimary}
              tilt={3}
              className="mo-glass-pill mo-glass-lit mo-press group inline-flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 text-[12px] font-medium tracking-[0.16em] uppercase"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                color: "var(--mo-fg)",
              }}
            >
              Schedule a call
              <span
                aria-hidden="true"
                className="transition-transform duration-200 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </GlassSurface>

            <GlassSurface
              as="a"
              href="#work"
              data-testid={HERO.ctaSecondary}
              tilt={3}
              className="mo-glass-pill mo-press group inline-flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 text-[12px] font-medium tracking-[0.16em] uppercase"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                color: "var(--mo-fg)",
              }}
            >
              Explore the work
            </GlassSurface>
          </div>
        </div>
      </div>
    </section>
  );
}
