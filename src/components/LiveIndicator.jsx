import { Typography } from '@douyinfe/semi-ui';
import React from 'react';
import fastMemo from 'react-fast-memo';

export const LiveIndicator = fastMemo(({ size, text }) => {
  const glowSize = size / 2; // Adjust glow size relative to the dot size

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px' }}>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: 'red',
          boxShadow: `0 0 ${glowSize}px ${glowSize / 4}px red`,
          animation: 'pulse 1.5s infinite',
        }}
      />
      {/* "LIVE" Text */}
      {!!text && <Typography.Text>{text}</Typography.Text>}
      {/* Keyframes */}
      <style>
        {`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 ${glowSize}px ${glowSize / 4}px red;
            }
            50% {
              box-shadow: 0 0 ${glowSize * 2}px ${glowSize / 2}px red;
            }
            100% {
              box-shadow: 0 0 ${glowSize}px ${glowSize / 4}px red;
            }
          }
        `}
      </style>
    </div>
  );
});
