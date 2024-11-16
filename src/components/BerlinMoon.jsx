import { Typography } from '@douyinfe/semi-ui';
import React from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Flex } from '../shared/semi/Flex.jsx';
import { positionCat } from '../store/moonCats.jsx';

export const BerlinMoon = fastMemo(() => {
  const position = useCat(positionCat);

  if (position?.isDefault) {
    return (
      <Flex align="center" gap="1rem" m="0 0 1rem">
        <Typography.Title heading={5}>Moon in Berlin</Typography.Title>
      </Flex>
    );
  }

  return null;
});
