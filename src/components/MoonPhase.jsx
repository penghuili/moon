import React from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { moonDataCat } from '../store/moonCats.jsx';

export const MoonPhase = fastMemo(({ size = 100 }) => {
  const moonData = useCat(moonDataCat);

  if (
    moonData?.fraction === undefined ||
    moonData?.angle === undefined ||
    moonData?.parallacticAngle === undefined
  ) {
    return null;
  }

  const { fraction, angle, parallacticAngle } = moonData;

  const viewBoxSize = 200;
  const radius = viewBoxSize * 0.475; // Radius of the moon
  const center = viewBoxSize / 2;

  // Calculate the zenith angle and adjust for SVG coordinate system
  const zenithAngle = angle - parallacticAngle;
  // Add 90 degrees to rotate from west (SVG 0°) to north (astronomical 0°)
  const rotationAngle = (zenithAngle * 180) / Math.PI + 90;

  // Create the path for the moon phase
  const pathD =
    fraction <= 0.5
      ? `M ${center} ${center - radius}
       A ${radius} ${radius} 0 1 1 ${center} ${center + radius}
       A ${radius * (1 - 2 * fraction)} ${radius} 0 1 0 ${center} ${center - radius}`
      : `M ${center} ${center - radius}
       A ${radius} ${radius} 0 1 1 ${center} ${center + radius}
       A ${radius * (2 * fraction - 1)} ${radius} 0 1 1 ${center} ${center - radius}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      style={{
        transform: `rotate(${rotationAngle}deg)`,
        transformOrigin: 'center',
      }}
    >
      {/* Moon base circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="#1f1f1f" // Adjusted color
        stroke="none"
      />

      {/* Illuminated part */}
      <path d={pathD} fill="#FFC850" stroke="none" />
    </svg>
  );
});
