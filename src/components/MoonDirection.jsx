import { RiArrowUpFill } from '@remixicon/react';
import React, { useMemo } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { moonDataCat } from '../store/moonCats.jsx';

export const MoonDirection = fastMemo(() => {
  const moonData = useCat(moonDataCat);

  const moonDirection = useMemo(() => {
    if (!moonData.azimuth) {
      return 0;
    }

    const azimuthDegrees = (moonData.azimuth * 180) / Math.PI - 180;
    return (azimuthDegrees + 360) % 360;
  }, [moonData.azimuth]);

  return (
    <div>
      <h2 style={{ margin: '3rem 0 0' }}>Direction</h2>
      <div
        style={{
          transform: `rotate(${moonDirection}deg)`,
          transition: 'transform 0.5s',
          marginTop: '20px',
        }}
      >
        <RiArrowUpFill size={80} color="#FFC850" />
      </div>
    </div>
  );
});
