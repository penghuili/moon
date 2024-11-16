import React from 'react';
import { BabyRoutes } from 'react-baby-router';
import fastMemo from 'react-fast-memo';

import { isMobileWidth } from './shared/browser/device.js';
import { CalibrateCompass } from './views/CalibrateCompass.jsx';
import { Home } from './views/Home.jsx';

export function Router() {
  return <AllRoutes />;
}

const publicRoutes = {
  '/compass': CalibrateCompass,
  '/': Home,
};

const AllRoutes = fastMemo(() => {
  return (
    <BabyRoutes
      routes={publicRoutes}
      enableAnimation={isMobileWidth()}
      bgColor="var(--semi-color-bg-0)"
      maxWidth="600px"
    />
  );
});
