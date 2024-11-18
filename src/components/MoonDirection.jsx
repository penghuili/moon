import { Tooltip, Typography } from '@douyinfe/semi-ui';
import React, { useMemo } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { moonDataCat } from '../store/moonCats.jsx';
import { InfoIconForTooltip } from './InfoIconForTooltip.jsx';

export const MoonDirection = fastMemo(() => {
  const moonData = useCat(moonDataCat);

  const moonDirection = useMemo(() => {
    if (!moonData.azimuth) {
      return 0;
    }

    const azimuthDegrees = (moonData.azimuth * 180) / Math.PI - 180;
    return (azimuthDegrees + 360) % 360;
  }, [moonData.azimuth]);

  const rounded = Math.round(moonDirection);
  return (
    <div style={{ padding: '0 1.5rem 0.5rem 0', position: 'relative' }}>
      <Cross degree={moonDirection} />
      <Typography.Text
        style={{
          position: 'absolute',
          bottom: -6,
          right: rounded > 99 ? -12 : -8,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {rounded}°
      </Typography.Text>
      <Tooltip content="Use Google map or a compass app to find the red arrow direction, that's where you find the moon.">
        <InfoIconForTooltip style={{ position: 'absolute', bottom: 80, right: 5 }} />
      </Tooltip>
    </div>
  );
});

const Cross = fastMemo(({ degree }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="80"
      height="80"
      viewBox="0 0 200 200"
      style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}
    >
      {/* Outer Circle */}
      <circle cx="100" cy="100" r="95" stroke="black" strokeWidth="3" fill="#f5f5dc" />

      {/* Inner Circle */}
      <circle cx="100" cy="100" r="80" stroke="black" strokeWidth="1" fill="none" />

      {/* Compass Rose */}
      <g>
        <polygon
          points="100,10 105,100 100,190 95,100"
          fill="gold"
          stroke="black"
          strokeWidth="1"
        />
        <polygon
          points="10,100 100,95 190,100 100,105"
          fill="gold"
          stroke="black"
          strokeWidth="1"
        />
      </g>

      {/* North Label */}
      <text
        x="100"
        y="0" // Adjusted position to move "N" outside the circle
        textAnchor="middle"
        fontSize="24" // Increased font size
        fontWeight="bold"
        fill="black"
      >
        N
      </text>

      {/* Red Arrow */}
      <g transform={`rotate(${degree}, 100, 100)`}>
        <polygon points="100,25 108,100 92,100" fill="red" stroke="black" strokeWidth="2" />
      </g>
    </svg>
  );
});
