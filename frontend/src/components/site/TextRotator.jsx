import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * TextRotator
 *
 * A vertical "slot machine" word rotator. Cycles infinitely through `words`,
 * with each new word rolling in from below while fading in, and the outgoing
 * word rolling further up while fading out — vertical motion only, no
 * horizontal movement.
 *
 * At rest, the current word is always 100% opaque, fully sharp and centered
 * within a slightly taller-than-1em box (no mask/gradient), so ascenders and
 * descenders (e.g. the "y" in "loyalty") never get clipped.
 *
 * The container's width is driven by an invisible sizer span so it resizes
 * smoothly (via the `layout` animation) as word length changes.
 */
export default function TextRotator({
  words = [],
  interval = 2500,
  className = "",
  style = {},
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  const current = words[index] ?? "";

  return (
    <motion.span
      layout
      transition={{ layout: { duration: 0.4, ease: [0.65, 0, 0.35, 1] } }}
      className={`relative inline-flex items-center overflow-hidden align-middle ${className}`}
      style={{
        height: "1.3em",
        ...style,
      }}
    >
      {/* Invisible sizer — keeps the container width matched to the current
          word without a hardcoded width, so it animates smoothly via `layout`. */}
      <span aria-hidden="true" className="invisible whitespace-nowrap">
        {current}
      </span>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={current}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex items-center justify-start whitespace-nowrap"
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
