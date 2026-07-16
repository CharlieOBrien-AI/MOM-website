import { useEffect, useRef } from "react";

/**
 * TextRotator
 *
 * Vertical "slot machine" word rotator, matching this exact mechanism:
 *
 * - A viewport box sized to exactly one line (height: 1em, overflow: hidden)
 *   with a vertical mask-image that fades the top/bottom ~26% so words
 *   blur in/out as they cross the edges instead of popping.
 * - A flex-column stack containing every word plus a duplicate of the first
 *   word appended at the end (`[...words, words[0]]`) — all rendered as
 *   static children at once (no conditional re-rendering).
 * - Every `interval` ms, the stack is shifted up by exactly one more `1em`
 *   via `translateY(-Nem)` with a CSS transition (cubic-bezier "drum
 *   roller" easing: quick acceleration, soft landing).
 * - When the stack lands on the duplicated first word (the Nth position),
 *   right after that transition finishes, the stack is snapped back to
 *   `translateY(0)` with `transition: none` (imperative DOM manipulation
 *   via a ref, done outside React's render cycle) so the reset is
 *   invisible and the loop reads as infinite.
 */
// Height of each rotator slot, in em. Must be tall enough to fit ascenders
// and descenders of the (italic serif) font without clipping. The stack is
// shifted by exactly this amount per tick, so item height and shift stay in
// sync.
const SLOT_EM = 1.35;

export default function TextRotator({
  words = [],
  interval = 2500,
  active = true,
  className = "",
  style = {},
}) {
  const stackRef = useRef(null);
  const indexRef = useRef(0);

  const rollWords = words.length > 0 ? [...words, words[0]] : words;

  useEffect(() => {
    if (words.length < 2 || !active) return;
    const n = words.length;
    indexRef.current = 0;

    const tick = () => {
      const el = stackRef.current;
      if (!el) return;

      indexRef.current += 1;
      el.style.transition = "transform 0.7s cubic-bezier(0.76,0,0.24,1)";
      el.style.transform = `translateY(-${indexRef.current * SLOT_EM}em)`;

      if (indexRef.current === n) {
        setTimeout(() => {
          const node = stackRef.current;
          if (!node) return;
          node.style.transition = "none";
          indexRef.current = 0;
          node.style.transform = "translateY(0)";
          // Force a reflow so the "none" transition is committed before
          // the next tick re-enables the transition.
          void node.offsetHeight;
        }, 720);
      }
    };

    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [words, interval, active]);

  if (words.length === 0) return null;

  // The longest word is used as an invisible spacer to give the outer span
  // its intrinsic width without pulling the animated stack into the flow.
  const longestWord = words.reduce((a, b) => (a.length >= b.length ? a : b));

  // The visible viewport reserves half the extra room above and half below
  // the baseline 1em line-box, so ascenders and descenders can breathe.
  const overshoot = (SLOT_EM - 1) / 2; // in em

  return (
    <span
      className={`relative inline-block align-baseline ${className}`}
      style={{
        // Keep the rotator's line-box height at 1em so it doesn't push the
        // surrounding lines apart. The taller animation viewport lives on
        // an absolutely-positioned inner layer that overflows this box.
        height: "1em",
        lineHeight: "1em",
        ...style,
      }}
    >
      {/* Invisible spacer sets the outer span's width to the widest word */}
      <span
        aria-hidden="true"
        className="whitespace-nowrap"
        style={{
          visibility: "hidden",
          paddingRight: "0.06em",
          lineHeight: "1em",
        }}
      >
        {longestWord}
      </span>

      {/* Animated viewport, taller than 1em, but positioned so it overflows
          equally above and below the line without affecting layout. */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `-${overshoot}em`,
          height: `${SLOT_EM}em`,
          overflow: "hidden",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)",
          pointerEvents: "none",
        }}
      >
        <span
          ref={stackRef}
          className="flex flex-col"
          style={{ willChange: "transform" }}
        >
          {rollWords.map((w, i) => (
            <span
              key={`${w}-${i}`}
              className="block whitespace-nowrap"
              style={{
                height: `${SLOT_EM}em`,
                lineHeight: `${SLOT_EM}em`,
                paddingRight: "0.06em",
              }}
            >
              {w}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
