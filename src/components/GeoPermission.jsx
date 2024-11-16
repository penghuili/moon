import { Button, Typography } from '@douyinfe/semi-ui';
import React, { useCallback, useEffect, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Flex } from '../shared/semi/Flex.jsx';
import { isCheckingGeoPermissionCat, positionCat } from '../store/moonCats.jsx';

function getUserLocation() {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      positionCat.set({ latitude, longitude });
    },
    error => console.error(error),
    { enableHighAccuracy: true }
  );
}

export const GeoPermission = fastMemo(() => {
  const position = useCat(positionCat);
  const isChecking = useCat(isCheckingGeoPermissionCat);

  const [permissionState, setPermissionState] = useState(null);

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
            setPermissionState('granted');
            getUserLocation();
          } else if (result.state === 'prompt') {
            setPermissionState('prompt');
          } else if (result.state === 'denied') {
            setPermissionState('denied');
          }
        })
        .catch(error => {
          setPermissionState('error');
          console.log(error);
        })
        .finally(() => isCheckingGeoPermissionCat.set(false));
    } else {
      setPermissionState('not-supported');
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
