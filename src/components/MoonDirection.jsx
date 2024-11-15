import { RiArrowUpFill } from '@remixicon/react';
import React, { useEffect, useMemo, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { moonDataCat } from '../store/moonCats.jsx';

export const MoonDirection = fastMemo(() => {
  const [deviceDirection, setDeviceDirection] = useState(0);

  const moonData = useCat(moonDataCat);

  const moonDirection = useMemo(() => {
    if (!moonData.azimuth) {
      return 0;
    }

    const azimuthDegrees = (moonData.azimuth * 180) / Math.PI - 180;
    return (azimuthDegrees + 360) % 360;
  }, [moonData.azimuth]);

  useEffect(() => {
    const handleOrientation = event => {
      const clockwiseDegrees = 360 - (event.alpha || 0);
      setDeviceDirection(clockwiseDegrees);
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return (
    <div>
      <h2 style={{ margin: '3rem 0 0' }}>Direction</h2>
      <div
        style={{
          transform: `rotate(${moonDirection - deviceDirection}deg)`,
          transition: 'transform 0.5s',
          marginTop: '20px',
        }}
      >
        <RiArrowUpFill size={80} color="#FFC850" />
      </div>
    </div>
  );
});
