import React, { useEffect, useMemo, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { moonDataCat } from '../store/moonCats.jsx';

export const MoonDirection = fastMemo(() => {
  const [direction, setDirection] = useState(0);
  const moonData = useCat(moonDataCat);

  const compassDirection = useMemo(() => {
    if (!moonData.azimuth) {
      return 0;
    }

    const azimuthDegrees = (moonData.azimuth * 180) / Math.PI;
    return (azimuthDegrees + 360) % 360;
  }, [moonData.azimuth]);

  useEffect(() => {
    const handleOrientation = event => {
      setDirection(event.alpha || 0); // alpha represents compass direction in degrees
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return (
    <div>
      <h2 style={{ margin: '3rem 0 0' }}>Direction</h2>
      <div
        style={{
          transform: `rotate(${direction - compassDirection}deg)`,
          transition: 'transform 0.5s',
          fontSize: '3em',
          marginTop: '20px',
        }}
      >
        ➡️
      </div>
    </div>
  );
});
