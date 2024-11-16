import { RiArrowUpFill } from '@remixicon/react';
import React, { useMemo } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { phoneNorthCat } from '../store/moonCats.jsx';
import { usePhoneDirection } from '../store/usePhoneDirection.js';

export const NorthDirection = fastMemo(() => {
  const phoneDirection = usePhoneDirection();
  const phoneNorth = useCat(phoneNorthCat);

  const rotateDegrees = useMemo(() => {
    if (phoneNorth !== null && phoneDirection !== null) {
      return phoneNorth - phoneDirection;
    }

    return 0;
  }, [phoneDirection, phoneNorth]);

  return (
    <div>
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
    </div>
  );
});
