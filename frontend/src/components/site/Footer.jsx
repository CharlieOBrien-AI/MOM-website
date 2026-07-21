import { FOOTER } from "@/constants/testIds";
import { Instagram, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      data-testid={FOOTER.root}
      style={{
        borderTop: "1px solid var(--mo-line)",
        background:
          "linear-gradient(180deg, rgba(6,6,10,0) 0%, rgba(10,8,20,0.35) 60%, rgba(10,8,20,0.55) 100%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
      }}
    >
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 section-px py-14">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/owl-logo.png"
            alt=""
            aria-hidden="true"
            className="h-8 w-8 object-contain"
            style={{
              filter: "drop-shadow(0 0 6px rgba(164,74,255,0.35))",
            }}
          />
          <span
            className="text-[13px] font-medium tracking-[0.16em] uppercase"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Midnight <span style={{ color: "var(--mo-accent)" }}>Owl</span>{" "}
            Media
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          {["Story", "Team", "Services"].map((l) => (
            <a
              key={l}
              href="#top"
              className="mo-press text-[11px] tracking-[0.14em] uppercase transition-colors duration-200 hover:text-white"
              style={{
                color: "var(--mo-fg-dim)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {l}
            </a>
          ))}
          <div className="flex items-center gap-3">
            {[
              { Icon: Instagram, label: "Instagram" },
              { Icon: Youtube, label: "YouTube" },
              { Icon: Linkedin, label: "LinkedIn" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#top"
                aria-label={label}
                className="mo-press grid h-8 w-8 place-items-center rounded-full border transition-[border-color,color] duration-200 ease-out hover:border-[var(--mo-accent)] hover:text-[var(--mo-accent)]"
                style={{
                  borderColor: "var(--mo-line-strong)",
                  color: "var(--mo-fg-dim)",
                }}
              >
                <Icon size={13} strokeWidth={1.6} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div
        className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 section-px pb-10"
        style={{
          color: "var(--mo-mute)",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "11px",
          letterSpacing: "0.08em",
        }}
      >
        <span>hi@midnightowl.media · © 2026 Midnight Owl Media</span>
        <span>Made in the small hours.</span>
      </div>
    </footer>
  );
}
