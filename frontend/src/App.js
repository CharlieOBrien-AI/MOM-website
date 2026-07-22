import "@/App.css";
import "lenis/dist/lenis.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import Home from "@/pages/Home";
import Brief from "@/pages/Brief";
import SiteBackground from "@/components/site/SiteBackground";

// Global Lenis config — production-tuned for both desktop and mobile.
// Base options come from the user-provided snippet; everything below adds
// the "best-for-web + apply to mobile" behavior on top:
//   - Desktop: buttery wheel smoothing with an expo-out easing.
//   - Mobile:  syncTouch:true routes native touch drag through Lenis so
//              touch/momentum scroll matches the desktop feel (Lenis does
//              NOT do this by default). syncTouchLerp + touchInertiaMultiplier
//              are the darkroom-recommended defaults from Lenis docs.
//   - autoToggle:true auto-disables Lenis under prefers-reduced-motion.
//   - anchors:true makes in-page href="#..." links smooth-scroll.
//   - allowNestedScroll:true keeps inner scrollers (Voices comment stack,
//              embla carousels, etc.) working normally.
const LENIS_OPTIONS = {
  // Time-based easing feels more predictable than pure lerp on long pages.
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease-out-expo
  // Desktop wheel
  smoothWheel: true,
  wheelMultiplier: 1,
  // Mobile / trackpad touch — the important part of "apply to mobile"
  syncTouch: true,
  syncTouchLerp: 0.075,
  touchInertiaMultiplier: 35,
  touchMultiplier: 1.2,
  // Original options requested by user
  autoRaf: true,
  autoToggle: true,
  anchors: true,
  allowNestedScroll: true,
  naiveDimensions: true,
  stopInertiaOnNavigate: true,
  // Standard verticals
  orientation: "vertical",
  gestureOrientation: "vertical",
};

/**
 * AppShell — the routed content. Wraps its children in <ReactLenis> for
 * routes that benefit from the buttery smooth scrolling (the marketing
 * landing page), and DELIBERATELY skips Lenis on the /brief form route.
 *
 * Why skip on /brief?
 *   Lenis with `syncTouch: true` proxies touch scroll through its own JS
 *   loop. On Android that fights with the native virtual-keyboard behavior:
 *   after focusing a field, typing, and dismissing the keyboard, subsequent
 *   scroll gestures would either be dropped or snap the visitor back
 *   toward the top of the page. Native touch scrolling handles the
 *   keyboard resize event correctly — so the fix is simply to NOT hand
 *   scrolling over to Lenis while the user is filling out a form.
 *
 *   NB: This also unmounts ReactLenis when the visitor navigates into
 *   /brief, and remounts it when they navigate back to /. That's cheap
 *   (Lenis is a tiny library) and keeps the two behaviors cleanly
 *   isolated with no runtime toggling of internal Lenis state.
 */
function AppShell() {
  const location = useLocation();
  const useSmoothScroll = location.pathname !== "/brief";

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
