import { useState } from "react";
import { Link } from "react-router-dom";
import GlassSurface from "@/components/glass/GlassSurface";
import GlassBackground from "@/components/glass/GlassBackground";
import Reveal from "@/components/site/Reveal";

const SERVICES = [
  "Video Production and Ad Films",
  "Digital Campaigns",
  "Social Media Management",
  "Content Series, Podcasts and YouTube",
  "Influencer Marketing and Amplification",
  "Something Else",
];

const monoStyle = { fontFamily: "JetBrains Mono, monospace" };
const serifStyle = { fontFamily: "Instrument Serif, serif" };

/**
 * Section — numbered form section. Wraps children in a Reveal so each
 * section fades up as the user scrolls the brief. Uses the site's existing
 * .mo-glass system so the visual language is consistent with the landing.
 */
function Section({ number, title, hint, children }) {
  return (
    <Reveal>
      <div className="mb-14 md:mb-20">
        <div className="mb-6 flex items-baseline gap-5">
          <span
            className="text-[13px] tracking-[0.28em]"
            style={{ ...monoStyle, color: "var(--mo-accent)" }}
          >
            {number}
          </span>
          <div>
            <h3
              className="text-white"
              style={{
                ...serifStyle,
                fontSize: "clamp(24px, 3vw, 34px)",
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
              }}
            >
              {title}
            </h3>
            {hint ? (
              <p
                className="mt-2 text-[13.5px] leading-[1.6]"
                style={{ ...monoStyle, color: "var(--mo-fg-dim)" }}
              >
                {hint}
              </p>
            ) : null}
          </div>
        </div>
        <div className="ml-0 md:ml-[68px]">{children}</div>
      </div>
    </Reveal>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-5">
      <label
        className="mb-2 block text-[11px] tracking-[0.22em] uppercase"
        style={{ ...monoStyle, color: "var(--mo-fg-dim)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * Input — dark themed underline input. Focus animates the underline to
 * accent color with a scaleX motion (matches the .mo-underline aesthetic
 * from the nav links). Only animates transform + color/border, per skills.
 */
function Input({ value, onChange, placeholder, type = "text", required }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full bg-transparent border-0 border-b py-3 text-[15px] text-white placeholder:text-[color:var(--mo-fg-dim)] focus:outline-none"
      style={{
        ...monoStyle,
        borderBottomColor: "var(--mo-line-strong)",
        borderBottomWidth: "1px",
        transition:
          "border-color 220ms var(--ease-out-strong), color 220ms ease",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderBottomColor = "var(--mo-accent)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderBottomColor = "var(--mo-line-strong)";
      }}
    />
  );
}

function TextArea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={8}
      className="w-full resize-none bg-transparent border rounded-xl py-4 px-5 text-[15px] text-white placeholder:text-[color:var(--mo-fg-dim)] focus:outline-none"
      style={{
        ...monoStyle,
        borderColor: "var(--mo-line-strong)",
        lineHeight: 1.7,
        transition: "border-color 220ms var(--ease-out-strong)",
        background: "rgba(255,255,255,0.02)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--mo-accent)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--mo-line-strong)";
      }}
    />
  );
}

/**
 * ServiceCheck — pill-style multi-select checkbox. Uses .mo-press for tap
 * feedback and border+background transitions for state. Gated hover-lift
 * via the .mo-glass-interactive rules already in index.css by adding it
 * conditionally when unchecked (so the checked state stays visually stable).
 */
function ServiceCheck({ label, checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mo-press flex w-full items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left"
      aria-pressed={checked}
      style={{
        ...monoStyle,
        borderColor: checked ? "var(--mo-accent)" : "var(--mo-line-strong)",
        background: checked
          ? "linear-gradient(135deg, rgba(164,74,255,0.16), rgba(164,74,255,0.06))"
          : "rgba(255,255,255,0.02)",
        color: checked ? "var(--mo-fg)" : "var(--mo-fg-dim)",
        transition:
          "border-color 220ms var(--ease-out-strong), background-color 220ms ease, color 220ms ease",
      }}
    >
      <span className="text-[13.5px]">{label}</span>
      <span
        aria-hidden="true"
        className="grid h-5 w-5 flex-none place-items-center rounded-full border"
        style={{
          borderColor: checked ? "var(--mo-accent)" : "var(--mo-line-strong)",
          background: checked ? "var(--mo-accent)" : "transparent",
          transition:
            "border-color 220ms var(--ease-out-strong), background-color 220ms ease",
        }}
      >
        {checked ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path
              d="M1.5 5.2 L4 7.7 L8.5 2.5"
              stroke="var(--mo-bg)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
    </button>
  );
}

export default function Brief() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    website: "",
    services: [],
    projectDetails: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleService = (s) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(s)
        ? f.services.filter((x) => x !== s)
        : [...f.services, s],
    }));

  const canSubmit =
    form.name.trim() &&
    form.email.trim() &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()) &&
    status !== "submitting";

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const backend = process.env.REACT_APP_BACKEND_URL || "";
      const res = await fetch(`${backend}/api/brief`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      setStatus("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <GlassBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Minimal header — logo left, back link right. No full Nav so the
            page reads as a focused, uncluttered task surface. */}
        <header className="relative z-20 mx-auto flex w-full max-w-[1240px] items-center justify-between section-px py-8">
          <Link
            to="/"
            className="mo-press flex items-center gap-2.5"
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
              style={monoStyle}
            >
              Midnight{" "}
              <span style={{ color: "var(--mo-accent)" }}>Owl</span> Media
            </span>
          </Link>

          <Link
            to="/"
            data-testid="brief-back"
            className="mo-press mo-underline text-[11px] tracking-[0.18em] uppercase transition-colors duration-200 hover:text-white"
            style={{ ...monoStyle, color: "var(--mo-fg-dim)" }}
          >
            ← Back
          </Link>
        </header>

        <main className="relative mx-auto w-full max-w-[880px] section-px pb-[120px] pt-6">
          {status === "sent" ? (
            <SuccessState />
          ) : (
            <>
              {/* Intro */}
              <Reveal>
                <div className="mb-14">
                  <div
                    className="mono-eyebrow mb-6"
                    style={{ color: "var(--mo-accent)" }}
                  >
                    // Project brief
                  </div>
                  <h1
                    className="text-white"
                    style={{
                      ...serifStyle,
                      fontSize: "clamp(40px, 6vw, 82px)",
                      lineHeight: 1.02,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Tell us about your{" "}
                    <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
                      project.
                    </span>
                  </h1>
                  <p
                    className="mt-8 max-w-[640px] text-[14.5px] leading-[1.75]"
                    style={{ ...monoStyle, color: "var(--mo-fg-dim)" }}
                  >
                    Thanks for showing interest in working with Midnight Owl
                    Media. Give us a quick overview of what you're working on.
                    We'll take a bird's-eye view, understand what you need, and
                    get back to you within 24 hours.
                  </p>
                </div>
              </Reveal>

              <form onSubmit={onSubmit} noValidate>
                <Section
                  number="01"
                  title="What's your name?"
                  hint="Let's start with an introduction."
                >
                  <Field label="Full name">
                    <Input
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Enter your full name"
                      required
                    />
                  </Field>
                </Section>

                <Section
                  number="02"
                  title="How can we reach you?"
                  hint="Share the best way for our team to contact you."
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Phone number">
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={update("phone")}
                        placeholder="Enter your phone number"
                      />
                    </Field>
                    <Field label="Email address">
                      <Input
                        type="email"
                        value={form.email}
                        onChange={update("email")}
                        placeholder="Enter your email address"
                        required
                      />
                    </Field>
                  </div>
                </Section>

                <Section
                  number="03"
                  title="Tell us about your brand"
                  hint="A little context helps us understand your business better."
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Company name">
                      <Input
                        value={form.company}
                        onChange={update("company")}
                        placeholder="Enter your company name"
                      />
                    </Field>
                    <Field label="Website or social media link">
                      <Input
                        value={form.website}
                        onChange={update("website")}
                        placeholder="Paste your link here"
                      />
                    </Field>
                  </div>
                </Section>

                <Section
                  number="04"
                  title="What do you need?"
                  hint="Select the services you're interested in."
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    {SERVICES.map((s) => (
                      <ServiceCheck
                        key={s}
                        label={s}
                        checked={form.services.includes(s)}
                        onToggle={() => toggleService(s)}
                      />
                    ))}
                  </div>
                </Section>

                <Section
                  number="05"
                  title="Tell us about the project"
                  hint="Share your goals, ideas, timeline, budget, or anything else we should know. The more context we have, the better we can understand the project."
                >
                  <TextArea
                    value={form.projectDetails}
                    onChange={update("projectDetails")}
                    placeholder="Start typing your brief here..."
                  />
                </Section>

                <Section
                  number="06"
                  title="Ready to send?"
                  hint="We'll review your brief and get back to you within 24 hours."
                >
                  <div className="flex flex-col items-start gap-4">
                    <GlassSurface
                      as="button"
                      type="submit"
                      disabled={!canSubmit}
                      data-testid="brief-submit"
                      tilt={3}
                      className="mo-glass-pill mo-glass-lit mo-press group inline-flex items-center gap-3 px-9 py-4 text-[12px] font-medium tracking-[0.22em] uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        ...monoStyle,
                        color: "var(--mo-fg)",
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06) 60%), linear-gradient(180deg, rgba(24,18,46,0.35), rgba(10,8,22,0.5))",
                      }}
                    >
                      {status === "submitting" ? "Sending…" : "Send your brief"}
                      {status === "submitting" ? null : (
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                        >
                          →
                        </span>
                      )}
                    </GlassSurface>

                    <p
                      className="text-[11px] tracking-[0.18em] uppercase"
                      style={{ ...monoStyle, color: "var(--mo-fg-dim)" }}
                    >
                      Your information stays private with our team.
                    </p>

                    {status === "error" ? (
                      <p
                        className="mt-2 text-[13px]"
                        style={{ color: "#ff8a8a", ...monoStyle }}
                        role="alert"
                      >
                        {errorMsg || "Something went wrong. Please try again."}
                      </p>
                    ) : null}
                  </div>
                </Section>
              </form>
            </>
          )}
        </main>
      </div>
    </>
  );
}

/**
 * SuccessState — replaces the form after a successful POST. Uses the
 * .mo-key-fade-up utility to slide-in from below, then a subtle gold-owl
 * glow to celebrate the moment (Rare frequency: delight budget available).
 */
function SuccessState() {
  return (
    <div className="mo-key-fade-up py-12 md:py-20 text-center">
      {/* Owl-eye glow — same visual language as the Contact section, subtle
          celebration for the delight tier per find-animation-opportunities. */}
      <div className="mx-auto flex justify-center gap-6">
        {[0, 1].map((i) => (
          <div
            key={i}
            aria-hidden="true"
            className="grid h-10 w-10 place-items-center rounded-full border"
            style={{
              borderColor: "var(--mo-accent-warm)",
              animation: `mo-eyepulse 2.6s ease ${i * 0.3}s infinite`,
            }}
          >
            <div
              className="h-4 w-4 rounded-full"
              style={{
                background: "var(--mo-accent-warm)",
                boxShadow: "0 0 22px var(--mo-accent-warm)",
              }}
            />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes mo-eyepulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.86); opacity: 0.55; }
        }
      `}</style>

      <h1
        data-testid="brief-success-heading"
        className="mt-10 text-white"
        style={{
          ...serifStyle,
          fontSize: "clamp(44px, 6vw, 92px)",
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
        }}
      >
        We've got your{" "}
        <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
          brief.
        </span>
      </h1>
      <p
        className="mx-auto mt-8 max-w-[540px] text-[14.5px] leading-[1.75]"
        style={{ ...monoStyle, color: "var(--mo-fg-dim)" }}
      >
        Thanks for sharing the details. Our team will review everything and get
        back to you within 24 hours.
      </p>

      <div className="mt-12 inline-flex">
        <GlassSurface
          as={Link}
          to="/"
          tilt={2.5}
          className="mo-glass-pill mo-press group inline-flex items-center gap-2 px-6 py-3.5 text-[12px] font-medium tracking-[0.18em] uppercase"
          style={{ ...monoStyle, color: "var(--mo-fg)" }}
        >
          Back to home
        </GlassSurface>
      </div>
    </div>
  );
}
