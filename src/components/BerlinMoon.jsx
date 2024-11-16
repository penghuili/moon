import { Typography } from '@douyinfe/semi-ui';
import React from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Flex } from '../shared/semi/Flex.jsx';
import { isCheckingGeoPermissionCat, positionCat } from '../store/moonCats.jsx';

export const BerlinMoon = fastMemo(() => {
  const position = useCat(positionCat);
  const isChecking = useCat(isCheckingGeoPermissionCat);

  if (position?.isDefault && !isChecking) {
    return (
      <Flex align="center" gap="1rem" m="1rem 0">
        <Typography.Title heading={5}>Moon in Berlin</Typography.Title>
      </Flex>
    );
  }

  return null;
});
