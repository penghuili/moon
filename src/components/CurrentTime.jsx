import { Typography } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import fastMemo from 'react-fast-memo';

import { formatDateTime } from '../shared/js/date.js';

export const CurrentTime = fastMemo(() => {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatDateTime(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Typography.Text
      style={{
        fontWeight: 'normal',
        position: 'relative',
        top: -75,
      }}
    >
      {time}
    </Typography.Text>
  );
});
