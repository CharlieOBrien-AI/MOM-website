import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * TextRotator
 *
 * Cycles infinitely through `words`. Each new word slides in horizontally
 * from the right while fading in, and the outgoing word slides out to the
 * left while fading out — with a soft left/right edge fade (via mask-image)
 * so the motion feels smooth rather than hard-clipped.
 *
 * The container's width is driven by an invisible sizer span so it resizes
 * smoothly (via the `layout` animation) as word length changes, instead of
 * jumping or being clipped.
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
      className={`relative inline-block overflow-hidden ${className}`}
      style={{
        height: "1em",
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 14%, black 86%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 14%, black 86%, transparent 100%)",
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
          initial={{ x: 22, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -22, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 whitespace-nowrap"
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
