import React, { useEffect, useMemo, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { getMoonIllumination, getMoonPosition, getTimes } from 'suncalc';

import { PageContent } from '../shared/browser/PageContent';

export const Home = fastMemo(() => {
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [direction, setDirection] = useState(null);
  const [moonData, setMoonData] = useState({});
  const [isMoonVisible, setIsMoonVisible] = useState(false);

  const compassDirection = useMemo(() => {
    if (!moonData.azimuth) {
      return 0;
    }

    const azimuthDegrees = (moonData.azimuth * 180) / Math.PI;
    return (azimuthDegrees + 360) % 360;
  }, [moonData.azimuth]);

  const moonShape = useMemo(() => {
    const phase = moonData.phase;
    if (!phase) {
      return null;
    }

    if (phase === 0) {
      return { icon: '🌑', text: 'New moon' };
    }
    if (phase > 0 && phase < 0.25) {
      return { icon: '🌒', text: 'Waxing Crescent' };
    }
    if (phase === 0.25) {
      return { icon: '🌓', text: 'First Quarter' };
    }
    if (phase > 0.25 && phase < 0.5) {
      return { icon: '🌔', text: 'Waxing Gibbous' };
    }
    if (phase === 0.5) {
      return { icon: '🌕', text: 'Full moon' };
    }
    if (phase > 0.5 && phase < 0.75) {
      return { icon: '🌖', text: 'Waning Gibbous' };
    }
    if (phase === 0.75) {
      return { icon: '🌗', text: 'Last Quarter' };
    }
    return { icon: '🌘', text: 'Waning Crescent' };
  }, [moonData.phase]);

  const moonPosition = useMemo(() => {
    const altitudeRadians = moonData.altitude;
    if (altitudeRadians === undefined) {
      return null;
    }
    const radius = 100; // Radius of the circle

    const x = Math.abs(radius * Math.cos(altitudeRadians)) * (moonData.phase > 0.5 ? -1 : 1);
    const y = Math.abs(radius * Math.sin(altitudeRadians)) * (moonData.altitude > 0 ? -1 : 1);

    return { x, y };
  }, [moonData]);

  const arrowPosition = useMemo(() => {
    const altitudeRadians = moonData.altitude;
    if (altitudeRadians === undefined) {
      return null;
    }

    const radius = 120; // Radius of the circle
    const offsetAngle = 5 * (Math.PI / 180); // 5-degree offset in radians

    // Calculate the moon's current position
    const x = Math.abs(radius * Math.cos(altitudeRadians)) * (moonData.phase > 0.5 ? -1 : 1);
    const y = Math.abs(radius * Math.sin(altitudeRadians)) * (moonData.altitude > 0 ? -1 : 1);

    // Calculate the arrow's position slightly offset in the moon's movement direction
    const arrowX =
      Math.abs(radius * Math.cos(altitudeRadians + offsetAngle)) * (moonData.phase > 0.5 ? -1 : 1);
    const arrowY =
      Math.abs(radius * Math.sin(altitudeRadians + offsetAngle)) * (moonData.altitude > 0 ? -1 : 1);

    return { x, y, arrowX, arrowY };
  }, [moonData]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setPosition({ latitude, longitude });
      },
      error => console.error(error),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    const handleOrientation = event => {
      setDirection(event.alpha); // alpha represents compass direction in degrees
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (position.latitude && position.longitude) {
        const now = new Date();
        const moonPos = getMoonPosition(now, position.latitude, position.longitude);
        const moonIllum = getMoonIllumination(now);
        const times = getTimes(now, position.latitude, position.longitude);

        const isNight = now >= times.night && now < times.nightEnd;
        const isAboveHorizon = moonPos.altitude > 0;
        setIsMoonVisible(isAboveHorizon && isNight);

        setMoonData({
          azimuth: moonPos.azimuth,
          altitude: moonPos.altitude,
          phase: moonIllum.phase,
        });
      }
    };

    updatePosition();
    const timer = setInterval(updatePosition, 60000);

    return () => clearInterval(timer);
  }, [position]);

  return (
    <PageContent paddingBottom="0">
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <svg width="220" height="220" viewBox="-110 -110 220 220" style={{ overflow: 'visible' }}>
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="orange" />
            </marker>
          </defs>

          {/* Circle representing the horizon */}
          <circle cx="0" cy="0" r="100" fill="lightblue" />
          {/* Darker bottom half */}
          <path
            d="M -100 0 A 100 100 0 0 0 100 0 L 0 0 Z"
            fill="black"
            opacity="0.6" // Optional: Adjust opacity for effect
          />
          {/* Horizon line dividing visible and invisible parts */}
          <line x1="-110" y1="0" x2="110" y2="0" stroke="gray" strokeWidth="2" />
          {/* Moon indicator */}
          {!!moonShape && !!moonPosition && (
            <text
              x={moonPosition.x}
              y={moonPosition.y}
              fontSize="20"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={moonData.altitude > 0 ? 'yellow' : 'gray'}
            >
              {moonShape.icon}
            </text>
          )}

          {!!arrowPosition && (
            <line
              x1={arrowPosition.x}
              y1={arrowPosition.y}
              x2={arrowPosition.arrowX}
              y2={arrowPosition.arrowY}
              stroke="orange"
              strokeWidth="2"
              markerEnd="url(#arrowhead)" // Optional: use an arrowhead marker
            />
          )}
        </svg>
      </div>

      <div style={{ textAlign: 'center', padding: '20px' }}>
        {!!moonShape && (
          <>
            <h1>{moonShape.text}</h1>
            <div>
              <span style={{ fontSize: '3em' }}>{moonShape.icon}</span>
            </div>
            {!isMoonVisible && <p>The moon is not visible right now.</p>}
          </>
        )}

        {direction !== null ? (
          <>
            <div
              style={{
                transform: `rotate(${direction - compassDirection}deg)`,
                transition: 'transform 0.5s',
                fontSize: '3em',
                marginTop: '20px',
              }}
            >
              ➡️
            </div>
            <p>Rotate your device to follow the moon's direction!</p>
          </>
        ) : (
          <p>Use your phone to see moon's direction.</p>
        )}
      </div>
    </PageContent>
  );
});
