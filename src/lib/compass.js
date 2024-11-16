import { isMobileBrowser } from '../shared/browser/device';
import { phoneNorthCat } from '../store/moonCats';

export const isCompassSupported = () => {
  return isMobileBrowser() && window.DeviceOrientationEvent !== undefined;
};

export function setCompassNorth(degrees) {
  phoneNorthCat.set(degrees);
}
