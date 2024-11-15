import { Typography } from '@douyinfe/semi-ui';
import { RiArrowUpDoubleLine, RiArrowUpFill } from '@remixicon/react';
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: 200,
          margin: '0 auto',
        }}
      >
        <RiArrowUpDoubleLine />
        <Typography.Text type="secondary" size="small">
          North
        </Typography.Text>
      </div>
      <div
        style={{
          width: 80,
          height: 80,
          transform: `rotate(${moonDirection}deg)`,
          margin: '0 auto',
        }}
      >
        <RiArrowUpFill size={80} color="#FFC850" />
      </div>
    </div>
  );
});
