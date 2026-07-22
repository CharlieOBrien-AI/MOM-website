import "@/App.css";
import "lenis/dist/lenis.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import Home from "@/pages/Home";
import Brief from "@/pages/Brief";
import SiteBackground from "@/components/site/SiteBackground";

// Global Lenis config — DESKTOP ONLY. Lenis is a great wheel-smoother on
// desktop but on touch devices (`syncTouch: true`) it proxies every touch
// event through a JS rAF loop, which is dramatically slower than the
// native compositor-thread scroll on modern iPhones and 120 Hz Androids.
// The result: sluggish, "not-quite-60fps" feel on phones. So we:
//   • Enable Lenis only on pointer:fine + hover:hover viewports (desktop
//     mice / trackpads) — where it genuinely improves the feel.
//   • Leave native scroll on touch devices — Android/iPhone Safari's
//     compositor scroll is already 120 Hz-capable and buttery.
const LENIS_OPTIONS = {
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease-out-expo
  smoothWheel: true,
  wheelMultiplier: 1,
  // Explicitly disable the JS touch-scroll proxy. This is what caused the
  // laggy feel on Android — even 120 Hz Androids can't beat native scroll
  // once every finger movement has to round-trip through a rAF callback.
  syncTouch: false,
  autoRaf: true,
  autoToggle: true,
  anchors: true,
  allowNestedScroll: true,
  naiveDimensions: true,
  stopInertiaOnNavigate: true,
  orientation: "vertical",
  gestureOrientation: "vertical",
};

/**
 * useIsPointerFine — true when the primary input device is a mouse or
 * trackpad (i.e. desktop). On touch phones/tablets returns false, so
 * the AppShell below skips the Lenis wrapper entirely and native scroll
 * takes over. Live-updates when the user plugs in / removes an
 * external mouse (rare, but respected).
 */
function useIsPointerFine() {
  const [isFine, setIsFine] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return true;
    return window.matchMedia("(pointer: fine) and (hover: hover)").matches;
  });
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(pointer: fine) and (hover: hover)");
    const onChange = (e) => setIsFine(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);
  return isFine;
}

/**
 * AppShell — the routed content. Wraps children in <ReactLenis> ONLY on
 * desktop (mouse / trackpad) AND for the marketing route. Everywhere
 * else — mobile, /brief form — we keep native browser scrolling so the
 * 120 Hz compositor path stays hot and the URL bar / keyboard behave
 * correctly. */
function AppShell() {
  const location = useLocation();
  const isDesktop = useIsPointerFine();
  const useSmoothScroll = isDesktop && location.pathname !== "/brief";

  // The routed content. Same tree either way; only the outer wrapper
  // differs so hot-reload / DOM diffing stays predictable.
  const body = (
    <div className="App">
      <div style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/brief" element={<Brief />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </div>
  );

  return useSmoothScroll ? (
    <ReactLenis root options={LENIS_OPTIONS}>
      {body}
    </ReactLenis>
  ) : (
    body
  );
}

function App() {
  return (
    <>
      {/* Global cinematic parallax wallpaper — MUST live outside the ReactLenis
          wrapper because Lenis applies a CSS transform to its root, which
          would silently break `position: fixed` on descendants (transformed
          ancestors become the containing block, so the "fixed" layer would
          scroll with the page instead of staying pinned to the viewport).

          SiteBackground renders the ONE continuous nightscape image
          (attachment #3 tree-branch purple sky vertically stacked on top of
          bg-3 misty-valley cabin, no gap) and slowly reveals it top-to-bottom
          as the visitor scrolls the page. See SiteBackground.jsx for details. */}
      <SiteBackground />
      {/* BrowserRouter must wrap AppShell so `useLocation()` inside AppShell
          has a routing context to consult when deciding whether to enable
          Lenis for the current route. */}
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </>
  );
}

export default App;
