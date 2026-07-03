import { useEffect, useState } from "react";
import { NAV } from "@/constants/testIds";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#work", label: "Work", testid: NAV.linkWork },
    { href: "#approach", label: "Approach", testid: NAV.linkApproach },
    { href: "#story", label: "Story", testid: NAV.linkStory },
    { href: "#team", label: "Team", testid: NAV.linkTeam },
    { href: "#services", label: "Services", testid: NAV.linkServices },
  ];

  return (
    <header
      data-testid={NAV.root}
      className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(10, 10, 11, 0.7)" : "rgba(10, 10, 11, 0.15)",
        borderBottom: scrolled ? "1px solid var(--mo-line)" : "1px solid transparent",
        backdropFilter: "blur(18px) saturate(140%)",
      }}
    >
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between section-px">
        <a
          href="#top"
          data-testid={NAV.logo}
          className="flex items-center gap-2.5"
          aria-label="Midnight Owl — home"
        >
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
            Midnight{" "}
            <span style={{ color: "var(--mo-accent)" }}>Owl</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={l.testid}
              className="text-[11px] tracking-[0.16em] uppercase transition-colors hover:text-[var(--mo-fg)]"
              style={{
                color: "var(--mo-fg-dim)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          data-testid={NAV.cta}
          className="group inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-medium tracking-[0.14em] uppercase transition-all"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            background: "var(--mo-fg)",
            color: "var(--mo-bg)",
            boxShadow: "0 4px 24px -8px rgba(164,74,255,0.4)",
          }}
        >
          Start a project
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
          >
            →
          </span>
        </a>
      </div>
    </header>
  );
}
