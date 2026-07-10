import SkyToggle from "@/components/ui/sky-toggle";
import { APPROACH } from "@/constants/testIds";

/**
 * PremiumToggle — Push / Pull mode switch.
 * Sun (day) = Push · Moon (night) = Pull, via the SkyToggle sky switch.
 * Text labels flank the switch; the active one is highlighted.
 */
export default function PremiumToggle({ value, onChange, disabled = false }) {
  const isPull = value === "pull";

  const onKeyDown = (e) => {
    if (disabled) return;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "Home") onChange("push");
      else onChange("pull");
    }
  };

  const labelStyle = (active, accent) => ({
    fontFamily: "JetBrains Mono, monospace",
    color: active ? accent : "var(--mo-mute)",
    textShadow: active ? `0 0 18px ${accent}55` : "none",
    transition: "color 350ms ease, text-shadow 350ms ease, opacity 350ms ease",
    opacity: active ? 1 : 0.75,
  });

  return (
    <div
      role="radiogroup"
      aria-label="Content mode"
      data-testid={APPROACH.toggleGroup}
      onKeyDown={onKeyDown}
      className="inline-flex select-none items-center gap-4"
    >
      <button
        type="button"
        role="radio"
        aria-checked={!isPull}
        data-testid={APPROACH.togglePush}
        tabIndex={!isPull ? 0 : -1}
        onClick={() => !disabled && onChange("push")}
        disabled={disabled}
        className="rounded-md px-1 py-1 text-[12px] font-medium tracking-[0.24em] uppercase outline-none focus-visible:ring-2 focus-visible:ring-[var(--mo-accent)]"
        style={labelStyle(!isPull, "var(--mo-accent-warm)")}
      >
        Push
      </button>

      <SkyToggle
        checked={isPull}
        disabled={disabled}
        onChange={(night) => onChange(night ? "pull" : "push")}
        size={20}
        label="Switch between Push (day) and Pull (night)"
        data-testid="sky-toggle-input"
      />

      <button
        type="button"
        role="radio"
        aria-checked={isPull}
        data-testid={APPROACH.togglePull}
        tabIndex={isPull ? 0 : -1}
        onClick={() => !disabled && onChange("pull")}
        disabled={disabled}
        className="rounded-md px-1 py-1 text-[12px] font-medium tracking-[0.24em] uppercase outline-none focus-visible:ring-2 focus-visible:ring-[var(--mo-accent)]"
        style={labelStyle(isPull, "var(--mo-accent)")}
      >
        Pull
      </button>
    </div>
  );
}
