import { Button, Card, Divider, Image, Typography } from '@douyinfe/semi-ui';
import { RiBeerLine, RiCodeLine, RiMailLine, RiRefreshLine } from '@remixicon/react';
import React from 'react';
import fastMemo from 'react-fast-memo';

import { CurrentTime } from '../components/CurrentTime.jsx';
import { DownloadMoon } from '../components/DownloadMoon.jsx';
import { GeoPermission } from '../components/GeoPermission.jsx';
import { LiveIndicator } from '../components/LiveIndicator.jsx';
import { MoonDirection } from '../components/MoonDirection';
import { MoonPhase } from '../components/MoonPhase.jsx';
import { MoonPosition } from '../components/MoonPosition';
import { Countdown, MoonRiseSet } from '../components/MoonRiseSet';
import { ProductHunt } from '../components/ProductHunt.jsx';
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
      <div style={{ textAlign: 'center', margin: '1rem 0 0' }}>
        <GeoPermission />

        {!!moonShape && (
          <>
            <Flex direction="row" justify="center" align="center" p="0">
              <LiveIndicator size={8} text="Data is updated every minute." />
            </Flex>

            <Flex direction="row" justify="center">
              <Card
                id="moon-card"
                title={<Card.Meta title={moonShape.message} style={{ padding: '1rem 0 0' }} />}
                headerExtraContent={
                  <IconButton
                    id="refresh-moon"
                    theme="borderless"
                    icon={<RiRefreshLine />}
                    onClick={() => updateMoonData()}
                    style={{ marginTop: '1rem' }}
                  />
                }
                cover={
                  <div>
                    <CurrentTime />
                    <DownloadMoon />
                    <div style={{ padding: '1rem 0' }}>
                      <MoonPhase />
                    </div>
                    <Divider />
                  </div>
                }
                shadows="always"
                style={{ width: '100%', maxWidth: 500, position: 'relative' }}
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
            </Flex>

            <MoonRiseSet />
          </>
        )}
      </div>

      <Divider margin="1rem" />

      <ProductHunt />

      <Typography.Title heading={4} style={{ textAlign: 'left' }}>
        <Image src="/icons/icon-192.png" width={23} height={23} alt="MoonFinder" /> moon finder:
        little page that helps you find the moon.
      </Typography.Title>

      <Typography.Title heading={5} style={{ textAlign: 'left', margin: '1rem 0 2rem' }}>
        Free, open source, no data is collected, everything happens in your browser.
      </Typography.Title>

      <Flex align="start" gap="1rem" m="0 0 2rem">
        <a href="https://github.com/penghuili/moonfinder" target="_blank">
          <Button icon={<RiCodeLine />} theme="outline">
            Source code
          </Button>
        </a>
        <Button theme="outline" icon={<RiMailLine />} onClick={copyContactEmailEffect}>
          Feedback: {contactEmail}
        </Button>
        <a href="https://buy.stripe.com/14k3fYcz633kb2oeV1" target="_blank">
          <Button theme="outline" icon={<RiBeerLine />}>
            Buy me a beer
          </Button>
        </a>
      </Flex>

      <AlsoBuilt />
    </PageContent>
  );
});
