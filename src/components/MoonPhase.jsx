import React from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { moonDataCat } from '../store/moonCats.jsx';

export const MoonPhase = fastMemo(({ size = 100 }) => {
  const moonData = useCat(moonDataCat);

  if (!moonData?.phase === undefined) {
    return null;
  }

  // Ensure phase is between 0 and 1
  const normalizedPhase = Math.max(0, Math.min(1, moonData.phase));

  const viewBoxSize = 200;
  const radius = viewBoxSize * 0.475; // 95 in original
  const center = viewBoxSize / 2;

  // Calculate the x position for the clipping circle
  const x = normalizedPhase * viewBoxSize;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
      {/* Moon circle */}
      <circle cx={center} cy={center} r={radius} fill="#FFC850" stroke="#000000" strokeWidth="2" />

      {/* Dark side of moon */}
      <circle cx={center} cy={center} r={radius} fill="#000000" mask="url(#moonMask)" />

      {/* Mask for creating the phase effect */}
      <mask id="moonMask">
        <rect x="0" y="0" width={viewBoxSize} height={viewBoxSize} fill="white" />
        <circle cx={x} cy={center} r={radius} fill="black" />
      </mask>
    </svg>
  );
});
