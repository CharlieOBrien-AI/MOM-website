import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * TextRotator
 *
 * A vertical "slot machine" word rotator. Cycles infinitely through `words`,
 * rolling the incoming/outgoing word vertically with a fade at the top and
 * bottom edges of the container (via mask-image) so words blur in/out
 * smoothly instead of hard-clipping.
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
      transition={{ layout: { duration: 0.45, ease: [0.65, 0, 0.35, 1] } }}
      className={`relative inline-block overflow-hidden ${className}`}
      style={{
        height: "1em",
        maskImage:
          "linear-gradient(180deg, transparent 0%, black 28%, black 72%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0%, black 28%, black 72%, transparent 100%)",
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
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-0 whitespace-nowrap"
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
