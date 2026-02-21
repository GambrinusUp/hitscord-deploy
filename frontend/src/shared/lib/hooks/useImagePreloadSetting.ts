import { useEffect, useState } from 'react';

const IMAGE_PRELOAD_KEY = 'preloadImages';

export const useImagePreloadSetting = () => {
  const [preloadImages, setPreloadImagesState] = useState<boolean>(() => {
    const saved = localStorage.getItem(IMAGE_PRELOAD_KEY);

    if (saved === null) return true;

    return saved === 'true';
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === IMAGE_PRELOAD_KEY && e.newValue !== null) {
        const nextValue = e.newValue === 'true';

        if (nextValue !== preloadImages) {
          setPreloadImagesState(nextValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [preloadImages]);

  const setPreloadImages = (value: boolean) => {
    localStorage.setItem(IMAGE_PRELOAD_KEY, String(value));
    setPreloadImagesState(value);
  };

  return { preloadImages, setPreloadImages };
};
