import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlassSurface from "@/components/glass/GlassSurface";
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
      className="fixed inset-x-0 top-0 z-50"
      style={{
        transition:
          "background 300ms var(--ease-out-strong), border-color 300ms var(--ease-out-strong), box-shadow 300ms var(--ease-out-strong)",
        background: scrolled
          ? "linear-gradient(180deg, rgba(10,8,22,0.55), rgba(10,8,22,0.35))"
          : "linear-gradient(180deg, rgba(10,8,22,0.20), rgba(10,8,22,0.05))",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.10)"
          : "1px solid transparent",
        WebkitBackdropFilter: "blur(22px) saturate(160%)",
        backdropFilter: "blur(22px) saturate(160%)",
        boxShadow: scrolled
          ? "inset 0 1px 0 rgba(255,255,255,0.10), 0 12px 40px -20px rgba(0,0,0,0.5)"
          : "inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between section-px">
        <a
          href="#top"
          data-testid={NAV.logo}
          className="flex items-center gap-2.5"
          aria-label="Midnight Owl Media — home"
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
            <span style={{ color: "var(--mo-accent)" }}>Owl</span> Media
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={l.testid}
              className="mo-press mo-underline text-[11px] tracking-[0.16em] uppercase transition-colors duration-200 hover:text-[var(--mo-fg)]"
              style={{
                color: "var(--mo-fg-dim)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <GlassSurface
          as={Link}
          to="/brief"
          data-testid={NAV.cta}
          tilt={2.5}
          className="mo-glass-pill mo-glass-lit mo-press group inline-flex items-center gap-2 px-4 py-2 text-[11px] font-medium tracking-[0.14em] uppercase"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            color: "var(--mo-fg)",
          }}
        >
          Schedule a call
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-0.5"
          >
            →
          </span>
        </GlassSurface>
      </div>
    </header>
  );
}
