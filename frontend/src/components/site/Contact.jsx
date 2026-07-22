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
          {/* Liquid-glass container — the "Let's tell some stories." moment
              sits INSIDE a transparent glass box now (per user request) so
              it reads as a distinct call-to-action floating above the site's
              cinematic nightscape, instead of dissolving into the sky. The
              glass adds a backdrop blur, a soft violet edge highlight and
              a subtle hover tilt without overpowering the copy. */}
          <GlassSurface
            className="mo-glass relative mx-auto max-w-[1080px] overflow-hidden rounded-[28px] text-center"
            tilt={1.5}
            style={{
              padding: "clamp(64px, 9vw, 140px) 40px",
              background: "rgba(15, 12, 28, 0.28)",
            }}
          >
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
          </GlassSurface>
        </Reveal>
      </div>
    </section>
  );
}
