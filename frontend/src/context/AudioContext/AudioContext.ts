import { createContext } from 'react';

export const AudioContext = createContext<
  | {
      setVolume: (userId: string, volume: number) => void;
      registerProducerUser: (producerId: string, userId: string) => void;
      userVolumes: Record<string, number>;
    }
  | undefined
>(undefined);
