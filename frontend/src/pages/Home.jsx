import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
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
      {/* Site-wide liquid-glass backdrop (fixed layer of drifting violet orbs). */}
      <GlassBackground />

      {/* Everything else sits above the backdrop. `relative` gives sections
          their own stacking context above the fixed orb layer. */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Nav />
        <main>
          <Hero />
          <Stats />
          <Approach />
          <Work />
          <HowItWorks />
          <Voices />
          <Contact />
          <FAQ />
        </main>
        <Footer />
      </div>
    </>
  );
}
