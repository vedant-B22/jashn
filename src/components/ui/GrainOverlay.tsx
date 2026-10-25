import React from 'react';

/**
 * Pure SVG noise film-grain overlay.
 * Uses inline feTurbulence with 0 image dependencies and 0 HTTP requests.
 * Fixed over the viewport at ~3.5% opacity for tactile editorial luxury.
 */
export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] select-none mix-blend-overlay"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="jashn-film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#jashn-film-grain)" />
      </svg>
    </div>
  );
}
