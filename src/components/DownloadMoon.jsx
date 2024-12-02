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
          // Set up options for scaling
          const scale = 3; // Scale factor (2x the original size)

          const options = {
            filter: node => !['refresh-moon', 'download-moon'].includes(node.id),
            width: cardDom.offsetWidth * scale, // Adjust width
            height: cardDom.offsetHeight * scale, // Adjust height
            style: {
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              width: `${cardDom.offsetWidth}px`, // Keep original width for rendering
              height: `${cardDom.offsetHeight}px`, // Keep original height for rendering
            },
          };

          domtoimage.toBlob(cardDom, options).then(blob => {
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
