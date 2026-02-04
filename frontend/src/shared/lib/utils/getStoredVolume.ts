import { AudioType } from '~/shared/lib/types';

export const getStoredVolume = (
  userId: string,
  type: AudioType = AudioType.STREAM_VOLUMES,
): number => {
  try {
    const stored = localStorage.getItem(type);

    if (stored) {
      const volumes = JSON.parse(stored);

      return volumes[userId] ?? 1;
    }
  } catch (error) {
    console.error('Error reading volume from localStorage:', error, type);
  }

  return 1;
};
