import { Timeline, Typography } from '@douyinfe/semi-ui';
import React, { useEffect, useMemo, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { formatDateTime } from '../shared/js/date.js';
import { Flex } from '../shared/semi/Flex';
import {
  getTimeDifference,
  moonDataCat,
  updateMoonData,
  useMoonTimes,
} from '../store/moonCats.jsx';
import styles from './MoonRiseSet.module.css';

export const MoonRiseSet = fastMemo(() => {
  const moonData = useCat(moonDataCat);

  if (moonData?.todayMoonrise === true) {
    return <p style={{ margin: '2rem 0 0' }}>Moon is visible all night.</p>;
  }
  if (moonData?.todayMoonset === true) {
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
        {data.map((i, index) => {
          let duration = null;
          if (i.visible && !data[index - 1]?.visible) {
            if (data[index + 1] && !data[index + 1].visible) {
              duration = getTimeDifference(i.date, data[index + 1].date);
            } else if (data[index + 2] && !data[index + 2].visible) {
              duration = getTimeDifference(i.date, data[index + 2].date);
            } else if (data[index + 3] && !data[index + 3].visible) {
              duration = getTimeDifference(i.date, data[index + 3].date);
            }
          }
          return (
            <Timeline.Item
              key={i.key}
              time={formatDateTime(i.date)}
              style={{
                backgroundColor: i.visible ? 'rgb(var(--semi-brand-2))' : undefined,
                position: 'relative',
              }}
            >
              <Typography.Text className={i.key === 'Now' ? styles.glowingText : ''}>
                {i.label}
              </Typography.Text>
              {!!duration && (
                <Typography.Text type="success" style={{ position: 'absolute', right: 8, top: 8 }}>
                  Visible for {duration}
                </Typography.Text>
              )}
            </Timeline.Item>
          );
        })}
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
      if (timeRemaining === '00') {
        clearInterval(timer);
        updateMoonData();
      }
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
    return <Typography.Title heading={5}>Moon is not visible</Typography.Title>;
  }

  return (
    <>
      Moon is visible in
      <Typography.Title heading={5}>{timeLeft}</Typography.Title>
      (if your sky is clear)
    </>
  );
});
