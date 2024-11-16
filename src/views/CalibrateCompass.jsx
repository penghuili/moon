import { Button, Typography } from '@douyinfe/semi-ui';
import React from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { NorthDirection } from '../components/NorthDirection.jsx';
import { setCompassNorth } from '../lib/compass.js';
import { PageContent } from '../shared/browser/PageContent';
import { PageHeader } from '../shared/semi/PageHeader.jsx';
import { phoneNorthCat } from '../store/moonCats.jsx';
import { usePhoneDirection } from '../store/usePhoneDirection.js';

export const CalibrateCompass = fastMemo(() => {
  const phoneDirection = usePhoneDirection();
  const phoneNorth = useCat(phoneNorthCat);

  return (
    <PageContent paddingBottom="0">
      <PageHeader title="Calibrate compass" hasBack />

      <Typography.Paragraph style={{ marginBottom: '1rem' }}>
        Compass in browser is not always accurate. You can use this page to calibrate the compass.
      </Typography.Paragraph>

      <Typography.Paragraph style={{ marginBottom: '0.5rem' }}>
        1. Place your phone towards north (You use can google map, or a compass app).
      </Typography.Paragraph>

      <Typography.Paragraph style={{ marginBottom: '0rem' }}>
        2. Is your phone facing the north?
      </Typography.Paragraph>
      <Button
        theme="solid"
        onClick={() => {
          if (phoneDirection !== null) {
            setCompassNorth(phoneDirection);
          }
        }}
        style={{ margin: '1rem 0 2rem' }}
      >
        Yes, my phone is facing the north
      </Button>

      {phoneNorth !== null && <NorthDirection />}
    </PageContent>
  );
});
