import "@/App.css";
import "lenis/dist/lenis.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import Home from "@/pages/Home";

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

function App() {
  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ReactLenis>
  );
}

export default App;
