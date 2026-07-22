import Nav from "@/components/site/Nav";
import CinematicIntro from "@/components/site/CinematicIntro";
import Stats from "@/components/site/Stats";
import Approach from "@/components/site/Approach";
import Work from "@/components/site/Work";
import HowItWorks from "@/components/site/HowItWorks";
import Voices from "@/components/site/Voices";
import Contact from "@/components/site/Contact";
import FAQ from "@/components/site/FAQ";
import Footer from "@/components/site/Footer";
import GlassBackground from "@/components/glass/GlassBackground";

export default function Home() {
  return (
    <>
      {/* Site-wide liquid-glass backdrop (fixed layer of drifting violet orbs).
          The nightscape parallax lives in <SiteBackground /> mounted at the
          App level (outside ReactLenis). */}
      <GlassBackground />

      {/* Everything else sits above the backdrop. `relative` gives sections
          their own stacking context above the fixed orb layer. */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Nav />
        <main>
          {/* Scroll-driven transition: the Hero video is pinned to the
              viewport for ~80vh of extra scroll while a black overlay
              fades in — as the fade completes, the Stats section slides
              up into view underneath, so the whole intro reads as ONE
              fluid movement rather than a Hero cut into Stats. */}
          <CinematicIntro />
          <Stats />
          <Approach />
          <HowItWorks />
          <Work />
          <Voices />
          <Contact />
          <FAQ />
        </main>
        <Footer />
      </div>
    </>
  );
}
