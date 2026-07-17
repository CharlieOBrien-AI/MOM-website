import "@/App.css";
import "lenis/dist/lenis.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import Home from "@/pages/Home";

// Global Lenis options mirror the user-provided snippet 1:1
// new Lenis({ autoRaf: true, autoToggle: true, anchors: true,
//            allowNestedScroll: true, naiveDimensions: true,
//            stopInertiaOnNavigate: true })
const LENIS_OPTIONS = {
  autoRaf: true,
  autoToggle: true,
  anchors: true,
  allowNestedScroll: true,
  naiveDimensions: true,
  stopInertiaOnNavigate: true,
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
