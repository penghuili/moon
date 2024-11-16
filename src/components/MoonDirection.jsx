import { Typography } from '@douyinfe/semi-ui';
import { RiArrowUpDoubleLine, RiArrowUpFill } from '@remixicon/react';
import React, { useMemo } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { isCompassSupported } from '../lib/compass.js';
import { RouteLink } from '../shared/semi/RouteLink.jsx';
import { moonDataCat, phoneNorthCat } from '../store/moonCats.jsx';
import { usePhoneDirection } from '../store/usePhoneDirection.js';

export const MoonDirection = fastMemo(() => {
  const moonData = useCat(moonDataCat);
  const phoneDirection = usePhoneDirection();
  const phoneNorth = useCat(phoneNorthCat);

  const moonDirection = useMemo(() => {
    if (!moonData.azimuth) {
      return 0;
    }

    const azimuthDegrees = (moonData.azimuth * 180) / Math.PI - 180;
    return (azimuthDegrees + 360) % 360;
  }, [moonData.azimuth]);

  const rotateDegrees = useMemo(() => {
    if (phoneNorth !== null && phoneDirection !== null) {
      return moonDirection - phoneDirection - phoneNorth;
    }

    return moonDirection;
  }, [moonDirection, phoneDirection, phoneNorth]);

  return (
    <div>
      <h2 style={{ margin: '3rem 0 0' }}>Direction</h2>
      {phoneNorth === null && (
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
      )}

      <div
        style={{
          width: 80,
          height: 80,
          transform: `rotate(${rotateDegrees}deg)`,
          margin: '0 auto',
        }}
      >
        <RiArrowUpFill size={80} color="#FFC850" />
      </div>

      {isCompassSupported() && phoneNorth === null && (
        <RouteLink to="/compass">Calibrate compass</RouteLink>
      )}
    </div>
  );
});
