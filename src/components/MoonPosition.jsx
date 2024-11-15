import React from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { moonDataCat } from '../store/moonCats.jsx';
import { MoonPhase } from './MoonPhase.jsx';

export const MoonPosition = fastMemo(() => {
  const moonData = useCat(moonDataCat);

  const horizonLength = 220; // Total length of the horizontal line
  const angleInDegrees = (moonData.altitude * 180) / Math.PI; // Convert radians to degrees
  // const angleInDegrees = -45;

  // Calculate the dynamic moon line length to extend to the horizon's end
  const moonLineLength = 200; // Half of the horizon line, from the person to the edge

  // Calculate moon's position based on altitude angle
  const moonX = moonLineLength * Math.cos((angleInDegrees * Math.PI) / 180);
  const moonY = -moonLineLength * Math.sin((angleInDegrees * Math.PI) / 180);

  const height = Math.abs(moonY) + 60;

  // Person's eye position
  const eyeX = 20; // Horizontal position of the person
  const eyeY = angleInDegrees < 0 ? 20 : height - 40; // Eye position slightly above the head's center

  return (
    <div>
      <h2 style={{ margin: '3rem 0 0' }}>
        {moonData.altitude > 0 ? 'Above Horizon' : 'Below Horizon'}{' '}
      </h2>
      <svg width="230" height={height} viewBox={`0 0 230 ${height}`}>
        {/* Horizon line */}
        <line
          x1={eyeX}
          y1={eyeY}
          x2={horizonLength}
          y2={eyeY}
          stroke="gray"
          strokeWidth="1"
          strokeDasharray="4, 4"
        />

        {/* Line to the moon */}
        <line
          x1={eyeX}
          y1={eyeY}
          x2={eyeX + moonX}
          y2={eyeY + moonY}
          stroke="orange"
          strokeWidth="2"
        />

        {/* Embedded MoonPhase component using foreignObject */}
        <foreignObject
          x={eyeX + moonX - 10} // Adjust the position relative to the moon's coordinates
          y={eyeY + moonY - 10} // Center the moon phase SVG
          width="20"
          height="20"
        >
          <MoonPhase size={20} />
        </foreignObject>

        {/* Person */}
        {/* Head */}
        <circle cx={eyeX} cy={eyeY} r="5" fill="black" />
        {/* Body */}
        <line x1={eyeX} y1={eyeY} x2={eyeX} y2={eyeY + 20} stroke="black" strokeWidth="1" />
        {/* Legs */}
        <line
          x1={eyeX}
          y1={eyeY + 20}
          x2={eyeX - 10}
          y2={eyeY + 30}
          stroke="black"
          strokeWidth="1"
        />
        <line
          x1={eyeX}
          y1={eyeY + 20}
          x2={eyeX + 10}
          y2={eyeY + 30}
          stroke="black"
          strokeWidth="1"
        />
        {/* Hands (pointing down) */}
        <line
          x1={eyeX}
          y1={eyeY + 5}
          x2={eyeX - 10}
          y2={eyeY + 15}
          stroke="black"
          strokeWidth="1"
        />
        <line
          x1={eyeX}
          y1={eyeY + 5}
          x2={eyeX + 10}
          y2={eyeY + 15}
          stroke="black"
          strokeWidth="1"
        />
        {/* Grassland */}
        <rect
          x={eyeX - 20} // Width of the grassland centered around the person
          y={eyeY + 30} // Start just below the feet
          width="40" // Total width
          height="5" // Height of the grassland
          fill="green"
        />
      </svg>
    </div>
  );
});
