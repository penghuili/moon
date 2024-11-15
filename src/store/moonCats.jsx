import { Typography } from '@douyinfe/semi-ui';
import { addDays, subDays } from 'date-fns';
import React, { useEffect, useMemo } from 'react';
import { getMoonIllumination, getMoonPosition, getMoonTimes, getTimes } from 'suncalc';
import { createCat, useCat } from 'usecat';

import { formatDateTime } from '../shared/js/date';

export const moonDataCat = createCat({});

export function useMoonData(position) {
  useEffect(() => {
    const updatePosition = () => {
      if (position.latitude && position.longitude) {
        const now = new Date();
        const moonPos = getMoonPosition(now, position.latitude, position.longitude);
        const moonIllum = getMoonIllumination(now);
        const sunTimes = getTimes(now, position.latitude, position.longitude);
        const tomorrowSunTimes = getTimes(addDays(now, 1), position.latitude, position.longitude);
        const moonTimes = getMoonRiseAndSet(position);

        const isNight = now >= sunTimes.night && now < sunTimes.nightEnd;
        const isAboveHorizon = moonPos.altitude > 0;

        moonDataCat.set({
          azimuth: moonPos.azimuth,
          altitude: moonPos.altitude,
          phase: moonIllum.phase,
          visible: isAboveHorizon && isNight,
          rise: moonTimes?.rise,
          set: moonTimes?.set,
          sunrise: sunTimes.sunrise,
          sunset: sunTimes.sunset,
          tomorrowSunrise: tomorrowSunTimes.sunrise,
          tomorrowSunset: tomorrowSunTimes.sunset,
        });
      }
    };

    updatePosition();

    const timer = setInterval(updatePosition, 60000);

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

    const delta = 0.02;
    if (phase < delta) {
      return 'New moon';
    }
    if (phase >= delta && phase < 0.25 - delta) {
      return 'Waxing Crescent';
    }
    if (phase >= 0.25 - delta && phase < 0.25 + delta) {
      return 'First Quarter';
    }
    if (phase >= 0.25 + delta && phase < 0.55 - delta) {
      return 'Waxing Gibbous';
    }
    if (phase >= 0.5 - delta && phase < 0.5 + delta) {
      return 'Full moon';
    }
    if (phase >= 0.5 + delta && phase < 0.75 - delta) {
      return 'Waning Gibbous';
    }
    if (phase >= 0.75 - delta && phase < 0.75 + delta) {
      return 'Last Quarter';
    }
    return 'Waning Crescent';
  }, [moonData.phase]);
}

export function useMoonTimes() {
  const moonData = useCat(moonDataCat);

  return useMemo(() => {
    if (moonData?.rise === true || moonData?.set === true) {
      return [];
    }

    if (!moonData?.rise || !moonData?.set) {
      return [];
    }

    const arr = [];
    const moonrise = { key: 'Moonrise', value: formatDateTime(moonData.rise) };
    arr.push(moonrise);
    if (moonData.sunrise > moonData.rise && moonData.sunrise < moonData.set) {
      if (moonData.sunrise > new Date()) {
        moonrise.start = true;
        moonrise.date = moonData.sunrise;
      }
      arr.push({
        key: 'VISIBLE for',
        value: (
          <Typography.Text strong type="success">
            {getTimeDifference(new Date(), moonData.sunrise)}
          </Typography.Text>
        ),
      });
      arr.push({ key: 'Sunrise', value: formatDateTime(moonData.sunrise) });
    }

    if (moonData.sunset > moonData.rise && moonData.sunset < moonData.set) {
      if (moonData.tomorrowSunrise < moonData.set) {
        arr.push({
          key: 'Sunset',
          value: formatDateTime(moonData.sunset),
          start: true,
          date: moonData.sunset,
        });
        arr.push({
          key: 'VISIBLE for',
          value: (
            <Typography.Text strong type="success">
              {getTimeDifference(moonData.sunset, moonData.tomorrowSunrise)}
            </Typography.Text>
          ),
        });
        arr.push({
          key: 'Sunrise',
          value: formatDateTime(moonData.tomorrowSunrise),
        });
      } else {
        arr.push({
          key: 'Sunset',
          value: formatDateTime(moonData.sunset),
          start: moonData.set > new Date(),
          date: moonData.sunset,
        });
        arr.push({
          key: 'VISIBLE for',
          value: (
            <Typography.Text strong type="success">
              {getTimeDifference(moonData.sunset, moonData.set)}
            </Typography.Text>
          ),
        });
      }
    }

    arr.push({ key: 'Moonset', value: formatDateTime(moonData.set) });

    return arr;
  }, [moonData.rise, moonData.set, moonData.sunrise, moonData.sunset, moonData.tomorrowSunrise]);
}

function getMoonRiseAndSet(position) {
  const now = new Date();
  const today = getMoonTimes(now, position.latitude, position.longitude);

  if (today.alwaysUp) {
    return { rise: true, set: null };
  }
  if (today.alwaysDown) {
    return { rise: null, set: true };
  }

  // Fetch moon times for yesterday, today, and tomorrow
  const yesterday = getMoonTimes(subDays(now, 1), position.latitude, position.longitude);
  const tomorrow = getMoonTimes(addDays(now, 1), position.latitude, position.longitude);

  // Case 1: Normal case (rise and set both valid today, rise < set)
  if (today.rise && today.set && today.rise < today.set) {
    if (today.set > now) return { rise: today.rise, set: today.set };
    if (today.rise > now) return { rise: today.rise, set: tomorrow.set };
  }

  // Case 2: If the moon hasn't set yet, use yesterday's rise and today's set
  if (today.set && today.set > now) {
    return { rise: yesterday.rise, set: today.set };
  }

  // Case 3: Today's rise is for the next cycle (rise > set)
  if (today.set && today.set < now) {
    return { rise: today.rise, set: tomorrow.set };
  }

  // Case 4: If no valid set today, use tomorrow's rise and set
  return null;
}

export function getTimeDifference(date1, date2) {
  // Ensure dates are in correct order (earlier date first)
  const diffInMilliseconds = Math.abs(date2 - date1);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMilliseconds % (1000 * 60)) / 1000);

  const hoursString = hours > 0 ? `${hours} hours ` : '';
  const minutesString = minutes > 0 ? `${minutes} minutes ` : '';
  const secondsString = `${seconds} seconds`;

  return `${hoursString}${minutesString}${secondsString}`.trim();
}
