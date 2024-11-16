import { Button, Typography } from '@douyinfe/semi-ui';
import React, { useCallback, useEffect } from 'react';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { Flex } from '../shared/semi/Flex.jsx';
import { isCheckingGeoPermissionCat, positionCat } from '../store/moonCats.jsx';

const permissionStateCat = createCat(null);

function getUserLocation() {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      positionCat.set({ latitude, longitude });
    },
    error => {
      console.log(error);
      if (error.code === error.PERMISSION_DENIED) {
        permissionStateCat.set('denied');
      }
    },
    { enableHighAccuracy: true }
  );
}

export const GeoPermission = fastMemo(() => {
  const position = useCat(positionCat);
  const isChecking = useCat(isCheckingGeoPermissionCat);
  const permissionState = useCat(permissionStateCat);

  const handleRequest = useCallback(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (navigator.permissions) {
      isCheckingGeoPermissionCat.set(true);
      navigator.permissions
        .query({ name: 'geolocation' })
        .then(result => {
          if (result.state === 'granted') {
            permissionStateCat.set('granted');
            getUserLocation();
          } else if (result.state === 'prompt') {
            permissionStateCat.set('prompt');
          } else if (result.state === 'denied') {
            permissionStateCat.set('denied');
          }
        })
        .catch(error => {
          permissionStateCat.set('error');
          console.log(error);
        })
        .finally(() => isCheckingGeoPermissionCat.set(false));
    } else {
      permissionStateCat.set('not-supported');
      // Fallback for older browsers
      getUserLocation();
    }
  }, []);

  if (position?.isDefault && !isChecking) {
    return (
      <Flex align="center" m="1rem 0 0">
        <Button theme="solid" disabled={permissionState !== 'prompt'} onClick={handleRequest}>
          Show moon in my location
        </Button>
        <Typography.Text>(Your location is only used in your browser)</Typography.Text>
        <Typography.Text>{permissionState}</Typography.Text>
        {permissionState === 'denied' && (
          <Typography.Text type="danger">
            Location permission is denied. Please enable it in your browser settings.
          </Typography.Text>
        )}
      </Flex>
    );
  }

  return null;
});
