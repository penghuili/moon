import { useEffect, useState } from 'react';

import { isCompassSupported } from '../lib/compass';

export function usePhoneDirection() {
  const [phoneDirection, setPhoneDirection] = useState(null);

  useEffect(() => {
    if (!isCompassSupported()) {
      return;
    }

    const handleOrientation = event => {
      const clockwiseDegrees = 360 - (event.alpha || 0);
      setPhoneDirection(clockwiseDegrees);
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return phoneDirection;
}
