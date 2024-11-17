import { Button, Card, Divider } from '@douyinfe/semi-ui';
import { RiCodeLine, RiMailLine, RiRefreshLine } from '@remixicon/react';
import React from 'react';
import fastMemo from 'react-fast-memo';

import { BerlinMoon } from '../components/BerlinMoon.jsx';
import { GeoPermission } from '../components/GeoPermission.jsx';
import { LiveIndicator } from '../components/LiveIndicator.jsx';
import { MoonDirection } from '../components/MoonDirection';
import { MoonPhase } from '../components/MoonPhase.jsx';
import { MoonPosition } from '../components/MoonPosition';
import { Countdown, MoonRiseSet } from '../components/MoonRiseSet';
import { PageContent } from '../shared/browser/PageContent';
import { copyContactEmailEffect } from '../shared/browser/store/sharedEffects.js';
import { contactEmail } from '../shared/js/constants.js';
import { AlsoBuilt } from '../shared/semi/AlsoBuilt.jsx';
import { Flex } from '../shared/semi/Flex.jsx';
import { IconButton } from '../shared/semi/IconButton.jsx';
import { updateMoonData, useInitMoonData, useMoonShape } from '../store/moonCats.jsx';

export const Home = fastMemo(() => {
  useInitMoonData();
  const moonShape = useMoonShape();

  return (
    <PageContent>
      <div style={{ textAlign: 'center' }}>
        <BerlinMoon />

        {!!moonShape && (
          <>
            <Flex direction="row" justify="center" align="center" p="1rem 0 0">
              <LiveIndicator size={8} text="Data is updated every minute." />
            </Flex>

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
              style={{ width: '100%', maxWidth: 500, margin: '1rem auto 0' }}
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

      <Divider margin="1rem" />

      <AlsoBuilt showBeer />

      <Flex align="start" gap="1rem">
        <a href="https://github.com/penghuili/moon" target="_blank">
          <Button icon={<RiCodeLine />} theme="outline">
            Source code
          </Button>
        </a>
        <Button theme="outline" icon={<RiMailLine />} onClick={copyContactEmailEffect}>
          Contact: {contactEmail}
        </Button>
      </Flex>
    </PageContent>
  );
});
