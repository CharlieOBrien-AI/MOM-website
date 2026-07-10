import SkyToggle from "@/components/ui/sky-toggle";
import { APPROACH } from "@/constants/testIds";

/**
 * PremiumToggle — Push / Pull mode switch.
 * Sun (day) = Push · Moon (night) = Pull, via the SkyToggle sky switch.
 * The current mode label lives INSIDE the switch track, opposite the knob.
 */
export default function PremiumToggle({ value, onChange, disabled = false }) {
  const isPull = value === "pull";

  const onKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "Home") {
      e.preventDefault();
      onChange("push");
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "End") {
      e.preventDefault();
      onChange("pull");
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(isPull ? "push" : "pull");
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Content mode — Push or Pull"
      data-testid={APPROACH.toggleGroup}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="inline-flex select-none items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--mo-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mo-bg)]"
    >
      <SkyToggle
        checked={isPull}
        disabled={disabled}
        onChange={(night) => onChange(night ? "pull" : "push")}
        size={24}
        label="Switch between Push (day) and Pull (night)"
        uncheckedLabel="Push"
        checkedLabel="Pull"
        uncheckedTestId={APPROACH.togglePush}
        checkedTestId={APPROACH.togglePull}
        data-testid="sky-toggle-input"
      />
    </div>
  );
}
