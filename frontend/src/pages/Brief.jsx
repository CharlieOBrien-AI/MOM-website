import { useState, useRef } from "react";
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

function Field({ label, required, error, hint, children, fieldRef }) {
  const hasError = Boolean(error);
  return (
    <div className="mb-5" ref={fieldRef}>
      <label
        className="mb-2 block text-[11px] tracking-[0.22em] uppercase"
        style={{ ...monoStyle, color: hasError ? "#ff8a8a" : "var(--mo-fg-dim)" }}
      >
        {label}
        {required ? (
          <span
            aria-hidden="true"
            className="ml-1"
            style={{ color: hasError ? "#ff8a8a" : "var(--mo-accent)" }}
          >
            *
          </span>
        ) : null}
      </label>
      {children}
      {hasError ? (
        <p
          role="alert"
          className="mt-2 text-[12.5px] leading-[1.5]"
          style={{ ...monoStyle, color: "#ff8a8a" }}
        >
          {error}
        </p>
      ) : hint ? (
        <p
          className="mt-2 text-[12px] leading-[1.5]"
          style={{ ...monoStyle, color: "var(--mo-fg-dim)" }}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Input — dark themed underline input. Focus animates the underline to
 * accent color with a scaleX motion (matches the .mo-underline aesthetic
 * from the nav links). Only animates transform + color/border, per skills.
 */
function Input({ value, onChange, placeholder, type = "text", required, error, ...rest }) {
  const errColor = "#ff8a8a";
  const restColor = error ? errColor : "var(--mo-line-strong)";
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      aria-invalid={Boolean(error) || undefined}
      className="w-full bg-transparent border-0 border-b py-3 text-[15px] text-white placeholder:text-[color:var(--mo-fg-dim)] focus:outline-none"
      style={{
        ...monoStyle,
        borderBottomColor: restColor,
        borderBottomWidth: "1px",
        transition:
          "border-color 220ms var(--ease-out-strong), color 220ms ease",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderBottomColor = error ? errColor : "var(--mo-accent)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderBottomColor = restColor;
      }}
      {...rest}
    />
  );
}

function TextArea({ value, onChange, placeholder, error }) {
  const errColor = "#ff8a8a";
  const restColor = error ? errColor : "var(--mo-line-strong)";
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={8}
      aria-invalid={Boolean(error) || undefined}
      className="w-full resize-none bg-transparent border rounded-xl py-4 px-5 text-[15px] text-white placeholder:text-[color:var(--mo-fg-dim)] focus:outline-none"
      style={{
        ...monoStyle,
        borderColor: restColor,
        lineHeight: 1.7,
        transition: "border-color 220ms var(--ease-out-strong)",
        background: "rgba(255,255,255,0.02)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = error ? errColor : "var(--mo-accent)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = restColor;
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
  const [errors, setErrors] = useState({}); // { fieldKey: "message" }
  const [summaryVisible, setSummaryVisible] = useState(false);

  // Refs to scroll first invalid field into view on submit.
  const fieldRefs = {
    name: useRef(null),
    phone: useRef(null),
    email: useRef(null),
    website: useRef(null),
    services: useRef(null),
    projectDetails: useRef(null),
  };

  const update = (k) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    // Clear error for this field as soon as the user starts fixing it —
    // avoids nagging red state while they're typing.
    if (errors[k]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[k];
        return next;
      });
    }
  };

  const toggleService = (s) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(s)
        ? f.services.filter((x) => x !== s)
        : [...f.services, s],
    }));
    if (errors.services) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.services;
        return next;
      });
    }
  };

  /**
   * validate — returns a { fieldKey: message } object of everything wrong.
   * Empty object = form is valid.
   *
   * Design: friendly, second-person messages that TELL the user how to fix
   * the problem, never generic "invalid input" strings. Required fields are
   * kept minimal (name + email + one service + a real description) so we
   * ask for context without adding friction.
   */
  const validate = (f) => {
    const e = {};
    const name = f.name.trim();
    const email = f.email.trim();
    const phone = f.phone.trim();
    const website = f.website.trim();
    const details = f.projectDetails.trim();

    if (!name) {
      e.name = "Please enter your name so we know who to reply to.";
    } else if (name.length < 2) {
      e.name = "That name looks too short — please enter your full name.";
    }

    if (!email) {
      e.email = "Please enter your email address so we can reach you.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      e.email = "That email doesn't look right — try something like you@company.com.";
    }

    if (phone) {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 6) {
        e.phone = "Phone number looks too short — please include the country/area code.";
      }
    }

    if (website) {
      // Loose URL check — accepts bare domains, socials, protocol-less input.
      const ok = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i.test(website);
      if (!ok) {
        e.website = "That link doesn't look right — paste a website URL or social profile link.";
      }
    }

    if (f.services.length === 0) {
      e.services = "Pick at least one service so we know what you're looking for.";
    }

    if (!details) {
      e.projectDetails = "Tell us a bit about the project so our team can review it.";
    } else if (details.length < 20) {
      e.projectDetails = "A little more context helps — please share at least a sentence or two.";
    }

    return e;
  };

  const errorCount = Object.keys(errors).length;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    // Run validation and surface errors inline + banner if anything is wrong.
    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSummaryVisible(true);
      // Scroll to the first invalid field so users don't have to hunt.
      const order = ["name", "phone", "email", "website", "services", "projectDetails"];
      const firstKey = order.find((k) => nextErrors[k]);
      if (firstKey && fieldRefs[firstKey]?.current) {
        try {
          fieldRefs[firstKey].current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } catch { /* older browsers — no-op */ }
      }
      return;
    }

    setErrors({});
    setSummaryVisible(false);
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
                {/* Summary banner — appears when user tries to submit with
                    invalid fields. Tells them exactly how many things need
                    fixing, so the disabled-submit mystery is gone. */}
                {summaryVisible && errorCount > 0 ? (
                  <Reveal>
                    <div
                      role="alert"
                      data-testid="brief-error-summary"
                      className="mb-10 rounded-2xl border px-5 py-4"
                      style={{
                        borderColor: "rgba(255,138,138,0.45)",
                        background:
                          "linear-gradient(135deg, rgba(255,138,138,0.09), rgba(255,138,138,0.03))",
                      }}
                    >
                      <p
                        className="text-[12px] tracking-[0.22em] uppercase"
                        style={{ ...monoStyle, color: "#ff8a8a" }}
                      >
                        {errorCount === 1
                          ? "1 thing needs your attention"
                          : `${errorCount} things need your attention`}
                      </p>
                      <p
                        className="mt-2 text-[13.5px] leading-[1.6]"
                        style={{ ...monoStyle, color: "var(--mo-fg)" }}
                      >
                        We highlighted them below in red — fix those and you're
                        ready to send.
                      </p>
                    </div>
                  </Reveal>
                ) : null}

                <Section
                  number="01"
                  title="What's your name?"
                  hint="Let's start with an introduction."
                >
                  <Field
                    label="Full name"
                    required
                    error={errors.name}
                    fieldRef={fieldRefs.name}
                  >
                    <Input
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Enter your full name"
                      required
                      error={errors.name}
                      data-testid="brief-input-name"
                    />
                  </Field>
                </Section>

                <Section
                  number="02"
                  title="How can we reach you?"
                  hint="Share the best way for our team to contact you."
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Phone number"
                      error={errors.phone}
                      fieldRef={fieldRefs.phone}
                    >
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={update("phone")}
                        placeholder="Enter your phone number"
                        error={errors.phone}
                        data-testid="brief-input-phone"
                      />
                    </Field>
                    <Field
                      label="Email address"
                      required
                      error={errors.email}
                      fieldRef={fieldRefs.email}
                    >
                      <Input
                        type="email"
                        value={form.email}
                        onChange={update("email")}
                        placeholder="Enter your email address"
                        required
                        error={errors.email}
                        data-testid="brief-input-email"
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
                        data-testid="brief-input-company"
                      />
                    </Field>
                    <Field
                      label="Website or social media link"
                      error={errors.website}
                      fieldRef={fieldRefs.website}
                    >
                      <Input
                        value={form.website}
                        onChange={update("website")}
                        placeholder="Paste your link here"
                        error={errors.website}
                        data-testid="brief-input-website"
                      />
                    </Field>
                  </div>
                </Section>

                <Section
                  number="04"
                  title="What do you need?"
                  hint="Select the services you're interested in."
                >
                  <div ref={fieldRefs.services}>
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
                    {errors.services ? (
                      <p
                        role="alert"
                        className="mt-3 text-[12.5px]"
                        style={{ ...monoStyle, color: "#ff8a8a" }}
                      >
                        {errors.services}
                      </p>
                    ) : null}
                  </div>
                </Section>

                <Section
                  number="05"
                  title="Tell us about the project"
                  hint="Share your goals, ideas, timeline, budget, or anything else we should know. The more context we have, the better we can understand the project."
                >
                  <div ref={fieldRefs.projectDetails}>
                    <TextArea
                      value={form.projectDetails}
                      onChange={update("projectDetails")}
                      placeholder="Start typing your brief here..."
                      error={errors.projectDetails}
                    />
                    {errors.projectDetails ? (
                      <p
                        role="alert"
                        className="mt-2 text-[12.5px]"
                        style={{ ...monoStyle, color: "#ff8a8a" }}
                      >
                        {errors.projectDetails}
                      </p>
                    ) : null}
                  </div>
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
                      disabled={status === "submitting"}
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
