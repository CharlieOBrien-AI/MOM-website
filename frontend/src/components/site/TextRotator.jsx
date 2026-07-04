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
  className = "",
  style = {},
}) {
  const stackRef = useRef(null);
  const indexRef = useRef(0);

  const rollWords = words.length > 0 ? [...words, words[0]] : words;

  useEffect(() => {
    if (words.length < 2) return;
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
  }, [words, interval]);

  if (words.length === 0) return null;

  return (
    <span
      className={`relative inline-block overflow-hidden align-bottom ${className}`}
      style={{
        height: `${SLOT_EM}em`,
        // Nudge the whole rotator down slightly so its baseline aligns
        // with the surrounding "1em line-height" text (the extra room
        // now lives above and below the glyphs, not inside them).
        verticalAlign: "-0.18em",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)",
        ...style,
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
  );
}
