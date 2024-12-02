import { RiDownloadLine } from '@remixicon/react';
import { format } from 'date-fns';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import React from 'react';
import fastMemo from 'react-fast-memo';

import { IconButton } from '../shared/semi/IconButton';

export const DownloadMoon = fastMemo(() => {
  return (
    <IconButton
      id="download-moon"
      theme="borderless"
      icon={<RiDownloadLine />}
      onClick={() => {
        const cardDom = document.getElementById('moon-card');
        if (cardDom) {
          domtoimage
            .toBlob(cardDom, {
              filter: node => !['refresh-moon', 'download-moon'].includes(node.id),
            })
            .then(blob => {
              saveAs(blob, `moon-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.png`);
            });
        }
      }}
      style={{
        position: 'absolute',
        bottom: 8,
        right: 20,
      }}
    />
  );
});
