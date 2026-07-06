import React from "react";

/**
 * GlassBackground — site-wide, fixed backdrop of slow-drifting violet orbs.
 *
 * Purpose: give the glass surfaces something to refract and reflect. Sits
 * at the very back (z-index: -1 within its own stacking context, mounted
 * before <main>), and never captures pointer events.
 *
 * Motion is restrained (per Apple-hardware style): each orb drifts on its
 * own long loop, hitting only a few tens of pixels of displacement. Users
 * with `prefers-reduced-motion: reduce` get static orbs (CSS handles this).
 */
export default function GlassBackground() {
  return (
    <div className="mo-bg-orbs" aria-hidden="true">
      {/* Base wash — very subtle radial vignette to anchor the composition */}
      <div className="mo-bg-vignette" />

      {/* Orbs. Each is a huge soft-blurred radial. Positions overlap so they
          blend into one continuous violet field. */}
      <div className="mo-orb mo-orb--a" />
      <div className="mo-orb mo-orb--b" />
      <div className="mo-orb mo-orb--c" />
      <div className="mo-orb mo-orb--d" />
      <div className="mo-orb mo-orb--e" />

      {/* Fine grain over everything to keep the glass from feeling plasticky */}
      <div className="mo-bg-grain" />
    </div>
  );
}
