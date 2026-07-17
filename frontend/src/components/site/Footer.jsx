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
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center rounded-full border"
            style={{
              borderColor: "var(--mo-line-strong)",
              background:
                "radial-gradient(circle at 50% 45%, var(--mo-accent) 0%, var(--mo-accent) 22%, transparent 24%), radial-gradient(circle at 50% 45%, rgba(212,162,86,0.2) 40%, transparent 60%)",
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
        <span>hello@midnightowl.media · © 2026 Midnight Owl Media</span>
        <span>Made in the small hours.</span>
      </div>
    </footer>
  );
}
