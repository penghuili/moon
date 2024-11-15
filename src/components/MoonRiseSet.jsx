import { Descriptions } from '@douyinfe/semi-ui';
import React, { useEffect, useMemo, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Flex } from '../shared/semi/Flex';
import { getTimeDifference, moonDataCat, useMoonTimes } from '../store/moonCats.jsx';

export const MoonRiseSet = fastMemo(() => {
  const moonData = useCat(moonDataCat);

  if (!moonData?.rise && !moonData?.set) {
    return null;
  }

  if (moonData?.rise === true) {
    return <p style={{ margin: '2rem 0 0' }}>Moon is visible all night.</p>;
  }
  if (moonData?.set === true) {
    return <p style={{ margin: '2rem 0 0' }}>Moon is not visible all day.</p>;
  }

  return <MoonRiseSetDates moonData={moonData} />;
});

const MoonRiseSetDates = fastMemo(() => {
  const data = useMoonTimes();

  return (
    <Flex m="2rem 0 0" align="center">
      <Descriptions data={data} />
    </Flex>
  );
});

export const Countdown = fastMemo(() => {
  const data = useMoonTimes();
  const targetDate = useMemo(() => data.find(i => i.start)?.date, [data]);

  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!targetDate || targetDate < new Date()) {
      return;
    }

    const timer = setInterval(() => {
      const timeRemaining = getTimeDifference(new Date(), targetDate);
      setTimeLeft(timeRemaining);
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!targetDate) {
    return null;
  }

  if (targetDate < new Date()) {
    return (
      <>
        <h1 style={{ margin: '0' }}>Moon is visible!</h1>
        (if your sky is clear)
      </>
    );
  }

  if (!timeLeft) {
    return null;
  }

  return (
    <>
      Moon is visible in
      <h1 style={{ margin: '0' }}>{timeLeft}</h1>
      (if your sky is clear)
    </>
  );
});
