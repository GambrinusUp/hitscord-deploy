import { useEffect, useState } from 'react';

const NOTIFICATION_VOLUME_KEY = 'notificationVolume';
const MAX_VOLUME = 0.525;
const BASE_VOLUME = 0.35;

export const useAudioSettings = () => {
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem(NOTIFICATION_VOLUME_KEY);

    return saved ? Number(saved) : BASE_VOLUME;
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === NOTIFICATION_VOLUME_KEY && e.newValue !== null) {
        const newVolume = Number(e.newValue);

        if (newVolume !== volume) {
          setVolume(newVolume);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [volume]);

  const setNotificationVolume = (newVolume: number) => {
    const clamped = Math.max(0, Math.min(MAX_VOLUME, newVolume));
    localStorage.setItem(NOTIFICATION_VOLUME_KEY, clamped.toString());
    setVolume(clamped);
  };

  const volumePercent = Math.round((volume / BASE_VOLUME) * 100);

  return {
    volume,
    volumePercent,
    setNotificationVolume,
  };
};
