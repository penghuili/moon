import React, { useEffect, useState } from 'react';
import fastMemo from 'react-fast-memo';

import { MoonDirection } from '../components/MoonDirection';
import { MoonPosition } from '../components/MoonPosition';
import { Countdown, MoonRiseSet } from '../components/MoonRiseSet';
import { PageContent } from '../shared/browser/PageContent';
import { useMoonData, useMoonShape } from '../store/moonCats.jsx';

export const Home = fastMemo(() => {
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  useMoonData(position);
  const moonShape = useMoonShape();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setPosition({ latitude, longitude });
      },
      error => console.error(error),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <PageContent paddingBottom="0">
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Countdown />

        {!!moonShape && (
          <>
            <h2 style={{ margin: '2rem 0 0' }}>{moonShape.text}</h2>
            <div>
              <span style={{ fontSize: '3em' }}>{moonShape.icon}</span>
            </div>

            <MoonDirection />

            <MoonPosition />

            <MoonRiseSet />
          </>
        )}
      </div>
    </PageContent>
  );
});
