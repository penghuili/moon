import { Timeline, Typography } from '@douyinfe/semi-ui';
import React, { useEffect, useMemo, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { formatDateTime } from '../shared/js/date.js';
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

  if (!data?.length) {
    return null;
  }

  return (
    <Flex
      align="start"
      style={{ textAlign: 'left', width: '100%', maxWidth: 400, margin: '2rem auto 0' }}
    >
      <Timeline>
        {data.map((i, index) => (
          <Timeline.Item key={i.key} time={formatDateTime(i.date)}>
            {i.label}
            {i.start && (
              <Typography.Paragraph>
                Moon is visible for{' '}
                <Typography.Text strong type="success">
                  {getTimeDifference(i.date, data[index + 1]?.date)}
                </Typography.Text>
                .
              </Typography.Paragraph>
            )}
          </Timeline.Item>
        ))}
      </Timeline>
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
