import { useContext } from 'react';

import { AudioContext } from './AudioContext';

export const useAudioContext = () => {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error('useAudioContext  must be used within a AudioProvider');
  }

  return context;
};
