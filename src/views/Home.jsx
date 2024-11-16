import { Card, Divider } from '@douyinfe/semi-ui';
import { RiRefreshLine } from '@remixicon/react';
import React from 'react';
import fastMemo from 'react-fast-memo';

import { BerlinMoon } from '../components/BerlinMoon.jsx';
import { GeoPermission } from '../components/GeoPermission.jsx';
import { MoonDirection } from '../components/MoonDirection';
import { MoonPhase } from '../components/MoonPhase.jsx';
import { MoonPosition } from '../components/MoonPosition';
import { Countdown, MoonRiseSet } from '../components/MoonRiseSet';
import { PageContent } from '../shared/browser/PageContent';
import { Flex } from '../shared/semi/Flex.jsx';
import { IconButton } from '../shared/semi/IconButton.jsx';
import { updateMoonData, useMoonData, useMoonShape } from '../store/moonCats.jsx';

export const Home = fastMemo(() => {
  useMoonData();
  const moonShape = useMoonShape();

  return (
    <PageContent paddingBottom="0">
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <BerlinMoon />

        {!!moonShape && (
          <>
            <Card
              title={<Card.Meta title={moonShape.message} />}
              headerExtraContent={
                <IconButton
                  theme="borderless"
                  icon={<RiRefreshLine />}
                  onClick={() => updateMoonData()}
                />
              }
              cover={
                <div>
                  <div style={{ padding: '1rem 0' }}>
                    <MoonPhase />
                  </div>
                  <Divider />
                </div>
              }
              shadows="always"
              style={{ width: '100%', maxWidth: 500, margin: '0 auto' }}
              bodyStyle={{ padding: 0 }}
            >
              <Flex direction="row" justify="center" align="end" p="0 1rem 0 0">
                <MoonDirection />
                <MoonPosition />
              </Flex>

              <Divider />

              <div style={{ padding: '1rem 0' }}>
                <Countdown />
              </div>
            </Card>

            <GeoPermission />

            <MoonRiseSet />
          </>
        )}
      </div>
    </PageContent>
  );
});
