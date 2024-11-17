import { RiInformationLine } from '@remixicon/react';
import React, { forwardRef } from 'react';

export const InfoIconForTooltip = forwardRef(({ style, ...props }, ref) => {
  return (
    <span ref={ref} style={style}>
      <RiInformationLine {...props} />
    </span>
  );
});
