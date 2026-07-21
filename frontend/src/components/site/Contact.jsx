import GlassSurface from "@/components/glass/GlassSurface";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import { CONTACT } from "@/constants/testIds";

/**
 * Contact — the closing "Let's tell some stories." moment.
 *
 * Previously carried a heavy golden inner-wash and two pulsing owl-eye
 * circles above the heading; both felt off-brand and dated. This rewrite
 * drops the ornament entirely and replaces the interior background with
 * one of the cinematic dark-purple nightscapes the user shipped, tinted
 * with a linear gradient to keep the type readable and the mood on-brand.
 */
export default function Contact() {
  return (
    <section
      id="contact"
      data-testid={CONTACT.root}
      className="relative overflow-hidden"
      style={{ background: "transparent" }}
    >
      <div className="mx-auto max-w-[1240px] section-px py-[70px]">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl text-center"
            style={{
              padding: "clamp(64px, 9vw, 140px) 40px",
              // Nightscape backdrop + linear dark tint so text stays legible
              // without hiding the artwork underneath.
              backgroundImage: [
                "linear-gradient(180deg, rgba(6,4,14,0.55) 0%, rgba(6,4,14,0.32) 45%, rgba(6,4,14,0.70) 100%)",
                "url('/images/bg/bg-3.webp')",
              ].join(", "),
              backgroundSize: "cover",
              backgroundPosition: "center",
              // Thin border matches other framed surfaces on the site.
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 80px -30px rgba(0,0,0,0.75)",
            }}
          >
            <div className="noise-overlay" aria-hidden="true" />

            <h2
              className="relative mx-auto max-w-[840px] text-white"
              style={{
                fontFamily: "Instrument Serif, serif",
                fontSize: "clamp(44px, 6vw, 92px)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {"Let's tell some"}{" "}
              <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
                stories.
              </span>
            </h2>

            <p
              className="relative mx-auto mt-8 max-w-[520px] text-[14.5px] leading-[1.7]"
              style={{
                color: "var(--mo-fg-dim)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              Book a free consultation session with us.
            </p>

            <div className="relative mt-10 inline-flex">
              <GlassSurface
                as={Link}
                to="/brief"
                data-testid={CONTACT.cta}
                className="mo-glass-pill mo-glass-lit mo-press group inline-flex items-center gap-2 px-8 py-4 text-[12px] font-medium tracking-[0.18em] uppercase"
                tilt={2.5}
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  color: "var(--mo-fg)",
                }}
              >
                Get In Touch
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                >
                  →
                </span>
              </GlassSurface>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
