import { AudioType } from '~/shared/lib/types';

export const saveVolumeToStorage = (
  userId: string,
  volume: number,
  type: AudioType = AudioType.STREAM_VOLUMES,
) => {
  try {
    const stored = localStorage.getItem(type);
    const volumes = stored ? JSON.parse(stored) : {};
    volumes[userId] = volume;
    localStorage.setItem(type, JSON.stringify(volumes));
  } catch (error) {
    console.error('Error saving volume to localStorage:', error, type);
  }
};
