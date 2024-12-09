import { addDays, addMinutes, subDays } from 'date-fns';
import { useEffect, useMemo } from 'react';
import { getMoonIllumination, getMoonPosition, getMoonTimes, getPosition, getTimes } from 'suncalc';
import { createCat, useCat } from 'usecat';

import { setToastEffect } from '../shared/browser/store/sharedEffects';
import { add0 } from '../shared/js/utils';

export const isCheckingGeoPermissionCat = createCat(false);
export const positionCat = createCat({ latitude: 52.52, longitude: 13.41, isDefault: true });
export const moonDataCat = createCat({});
export const phoneNorthCat = createCat(null);

export function useGeoLocation() {
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        positionCat.set({ latitude, longitude });
      },
      error => console.error(error),
      { enableHighAccuracy: true }
    );
  }, []);
}

export function updateMoonData(hideMessage) {
  const position = positionCat.get();

  if (position?.latitude !== undefined && position?.longitude !== undefined) {
    const now = new Date();
    const moonPos = getMoonPosition(now, position.latitude, position.longitude);
    const moonIllum = getMoonIllumination(now);

    const yesterdaySunTimes = getTimes(subDays(now, 1), position.latitude, position.longitude);
    const todaySunTimes = getTimes(now, position.latitude, position.longitude);
    const tomorrowSunTimes = getTimes(addDays(now, 1), position.latitude, position.longitude);
    const yesterdayMoonTimes = getMoonTimes(subDays(now, 1), position.latitude, position.longitude);
    const todayMoonTimes = getMoonTimes(now, position.latitude, position.longitude);
    const tomorrowMoonTimes = getMoonTimes(addDays(now, 1), position.latitude, position.longitude);

    const in10minPos = getMoonPosition(addMinutes(now, 10), position.latitude, position.longitude);
    const rising = in10minPos.altitude > moonPos.altitude;

    moonDataCat.set({
      azimuth: moonPos.azimuth,
      altitude: moonPos.altitude,
      phase: moonIllum.phase,
      fraction: moonIllum.fraction,
      angle: moonIllum.angle,
      parallacticAngle: moonPos.parallacticAngle,
      rising,

      yesterdayMoonrise: yesterdayMoonTimes.rise,
      yesterdayMoonset: yesterdayMoonTimes.set,
      todayMoonrise: todayMoonTimes.rise,
      todayMoonset: todayMoonTimes.set,
      tomorrowMoonrise: tomorrowMoonTimes.rise,
      tomorrowMoonset: tomorrowMoonTimes.set,
      yesterdaySunrise: yesterdaySunTimes.sunrise,
      yesterdaySunset: yesterdaySunTimes.sunset,
      todaySunrise: todaySunTimes.sunrise,
      todaySunset: todaySunTimes.sunset,
      tomorrowSunrise: tomorrowSunTimes.sunrise,
      tomorrowSunset: tomorrowSunTimes.sunset,
    });

    if (!hideMessage) {
      setToastEffect('Data is updated.');
    }
  }
}

export function useInitMoonData() {
  const position = useCat(positionCat);

  useEffect(() => {
    updateMoonData(true);

    const timer = setInterval(updateMoonData, 60000);

    return () => clearInterval(timer);
  }, [position]);
}

export function useMoonShape() {
  const moonData = useCat(moonDataCat);

  return useMemo(() => {
    const phase = moonData.phase;
    if (!phase) {
      return null;
    }

    const percentageOfLightPart = ((phase <= 0.5 ? phase / 0.5 : (1 - phase) / 0.5) * 100).toFixed(
      2
    );

    const delta = 0.03;
    let message;
    if (phase < delta) {
      message = 'New moon';
    }
    if (phase >= delta && phase < 0.25 - delta) {
      message = 'Waxing Crescent (growing)';
    }
    if (phase >= 0.25 - delta && phase < 0.25 + delta) {
      message = 'First Quarter (growing)';
    }
    if (phase >= 0.25 + delta && phase < 0.55 - delta) {
      message = 'Waxing Gibbous (growing)';
    }
    if (phase >= 0.5 - delta && phase < 0.5 + delta) {
      message = 'Full moon';
    }
    if (phase >= 0.5 + delta && phase < 0.75 - delta) {
      message = 'Waning Gibbous (shrinking)';
    }
    if (phase >= 0.75 - delta && phase < 0.75 + delta) {
      message = 'Last Quarter (shrinking)';
    }
    if (phase >= 0.75 + delta && phase < 1 - delta) {
      message = 'Waning Crescent (shrinking)';
    }
    if (phase >= 1 - delta) {
      message = 'New moon';
    }

    return { message, percent: percentageOfLightPart };
  }, [moonData.phase]);
}

export function useMoonTimes() {
  const moonData = useCat(moonDataCat);

  return useMemo(() => {
    if (moonData?.todayMoonrise === true || moonData?.todayMoonset === true) {
      return [];
    }

    const yesterdayMoonrise = {
      key: 'Yesterday Moonrise',
      label: 'Moonrise (yesterday)',
      date: moonData.yesterdayMoonrise,
      visible: getAngles(moonData.yesterdayMoonrise)?.sun < 0,
    };
    const yesterdayMoonset = {
      key: 'Yesterday Moonset',
      label: 'Moonset (yesterday)',
      date: moonData.yesterdayMoonset,
      visible: false,
    };
    const todayMoonrise = {
      key: 'Moonrise',
      label: 'Moonrise (today)',
      date: moonData.todayMoonrise,
      visible: getAngles(moonData.todayMoonrise)?.sun < 0,
    };
    const todayMoonset = {
      key: 'Moonset',
      label: 'Moonset (today)',
      date: moonData.todayMoonset,
      visible: false,
    };
    const tomorrowMoonrise = {
      key: 'Tomorrow Moonrise',
      label: 'Moonrise (tomorrow)',
      date: moonData.tomorrowMoonrise,
      visible: getAngles(moonData.todayMoonrise)?.sun < 0,
    };
    const tomorrowMoonset = {
      key: 'Tomorrow Moonset',
      label: 'Moonset (tomorrow)',
      date: moonData.tomorrowMoonset,
      visible: false,
    };

    const yesterdaySunrise = {
      key: 'Yesterday Sunrise',
      label: 'Sunrise (yesterday)',
      date: moonData.yesterdaySunrise,
      visible: false,
    };
    const yesterdaySunset = {
      key: 'Yesterday Sunset',
      label: 'Sunset (yesterday)',
      date: moonData.yesterdaySunset,
      visible: getAngles(moonData.yesterdaySunset)?.moon > 0,
    };
    const todaydaySunrise = {
      key: 'Today Sunrise',
      label: 'Sunrise (today)',
      date: moonData.todaySunrise,
      visible: false,
    };
    const todaySunset = {
      key: 'Today Sunset',
      label: 'Sunset (today)',
      date: moonData.todaySunset,
      visible: getAngles(moonData.todaySunset)?.moon > 0,
    };
    const tomorrowdaySunrise = {
      key: 'Tomorrow Sunrise',
      label: 'Sunrise (tomorrow)',
      date: moonData.tomorrowSunrise,
      visible: false,
    };
    const tomorrowSunset = {
      key: 'Tomorrow Sunset',
      label: 'Sunset (tomorrow)',
      date: moonData.tomorrowSunset,
      visible: getAngles(moonData.tomorrowSunset)?.moon > 0,
    };
    const nowAngels = getAngles(new Date());
    const now = {
      key: 'Now',
      label: 'Now',
      date: new Date(),
      visible: nowAngels?.moon > 0 && nowAngels?.sun < 0,
    };

    const dates = [
      yesterdayMoonrise,
      yesterdayMoonset,
      todayMoonrise,
      todayMoonset,
      tomorrowMoonrise,
      tomorrowMoonset,
      yesterdaySunrise,
      yesterdaySunset,
      todaydaySunrise,
      todaySunset,
      tomorrowdaySunrise,
      tomorrowSunset,
      now,
    ]
      .filter(d => d.date instanceof Date)
      .sort((a, b) => a.date - b.date);

    return dates;
  }, [
    moonData.yesterdayMoonrise,
    moonData.yesterdaySunset,
    moonData.yesterdaySunrise,
    moonData.yesterdayMoonset,
    moonData.todayMoonrise,
    moonData.todaySunset,
    moonData.todaySunrise,
    moonData.todayMoonset,
    moonData.tomorrowMoonrise,
    moonData.tomorrowSunset,
    moonData.tomorrowSunrise,
    moonData.tomorrowMoonset,
  ]);
}

export function getTimeDifference(date1, date2) {
  // Ensure dates are in correct order (earlier date first)
  const diffInMilliseconds = Math.abs(date2 - date1);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMilliseconds % (1000 * 60)) / 1000);

  const hoursString = hours > 0 ? `${hours}:` : '';
  const minutesString = minutes > 0 || hours > 0 ? `${add0(minutes)}:` : '';
  const secondsString = `${add0(seconds)}`;

  return `${hoursString}${minutesString}${secondsString}`.trim();
}

function getAngles(date) {
  if (!(date instanceof Date)) {
    return null;
  }
  const position = positionCat.get();
  const sunPosition = getPosition(date, position.latitude, position.longitude);
  const moonPosition = getMoonPosition(date, position.latitude, position.longitude);

  return { moon: moonPosition.altitude, sun: sunPosition.altitude };
}
