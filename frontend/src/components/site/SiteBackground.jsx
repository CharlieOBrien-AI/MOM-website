import { useEffect } from "react";

/**
 * SiteBackground — applies the continuous cinematic nightscape image
 * (attachment #3 tree-branch purple sky on top of bg-3 misty-valley cabin,
 * concatenated with no gap) to <body> as a scrolling background.
 *
 * The image lives in /public/images/bg/site-bg.webp and is referenced at
 * runtime via document.body.style so the URL never travels through
 * webpack's css-loader (which would try — and fail — to resolve it as a
 * module import). Everything else (repeat-y, background-size, etc.) is
 * defined once in index.css so this component only needs to set the URL.
 *
 * Cleans up on unmount so the class of pages that don't want the site
 * background (should any exist in the future) can opt out.
 */
export default function SiteBackground() {
  useEffect(() => {
    const prev = document.body.style.backgroundImage;
    document.body.style.backgroundImage =
      "url('/images/bg/site-bg.webp')";
    return () => {
      document.body.style.backgroundImage = prev;
    };
  }, []);

  return null;
}
