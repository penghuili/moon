import { Timeline, Typography } from '@douyinfe/semi-ui';
import React, { useEffect, useMemo, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { formatDateTime } from '../shared/js/date.js';
import { Flex } from '../shared/semi/Flex';
import { getTimeDifference, moonDataCat, useMoonTimes } from '../store/moonCats.jsx';
import styles from './MoonRiseSet.module.css';

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

  if (!data?.length) {
    return null;
  }

  return (
    <Flex
      align="start"
      style={{ textAlign: 'left', width: '100%', maxWidth: 400, margin: '2rem auto 0' }}
    >
      <Timeline>
        {data.map(i => (
          <Timeline.Item
            key={i.key}
            time={formatDateTime(i.date)}
            style={{
              backgroundColor: i.visible ? 'var(--semi-color-warning-light-active)' : undefined,
            }}
          >
            <Typography.Text className={i.key === 'Now' ? styles.glowingText : ''}>
              {i.label}
            </Typography.Text>
          </Timeline.Item>
        ))}
      </Timeline>
    </Flex>
  );
});

export const Countdown = fastMemo(() => {
  const moonTimes = useMoonTimes();

  const data = useMemo(() => {
    const nowData = moonTimes.find(i => i.key === 'Now' && i.visible);
    if (nowData) {
      return { visible: true };
    }

    const nextData = moonTimes.find(i => i.date > new Date() && i.visible);
    return { visible: false, date: nextData?.date };
  }, [moonTimes]);

  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (data.visible || !data.date) {
      return;
    }

    const timer = setInterval(() => {
      const timeRemaining = getTimeDifference(new Date(), data.date);
      setTimeLeft(timeRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [data]);

  if (data.visible) {
    return (
      <>
        <Typography.Title heading={5}>Moon is visible!</Typography.Title>
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
      <Typography.Title heading={5}>{timeLeft}</Typography.Title>
      (if your sky is clear)
    </>
  );
});
