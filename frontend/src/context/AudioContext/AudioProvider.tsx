import { useEffect, useRef, useState } from 'react';

import { AudioContext } from './AudioContext';

import { useMediaContext } from '~/context/MediaContext';
import { getStoredVolume } from '~/shared/lib/utils/getStoredVolume';
import { saveVolumeToStorage } from '~/shared/lib/utils/saveVolumeToStorage';

export const AudioProvider = (props: React.PropsWithChildren) => {
  const { consumers } = useMediaContext();
  const audioRefs = useRef(new Map());
  const [userVolumes, setUserVolumes] = useState<Record<string, number>>({});
  const producerToUserMap = useRef(new Map<string, string>());

  useEffect(() => {
    consumers.forEach(({ producerId, track, kind, appData }) => {
      const source = appData?.source;

      if (
        kind === 'audio' &&
        source !== 'screen-audio' &&
        !audioRefs.current.has(producerId)
      ) {
        const userId = producerToUserMap.current.get(producerId);
        const savedVolume = userId ? getStoredVolume(userId) : 1;

        const audio = document.createElement('audio');
        audio.srcObject = new MediaStream([track]);
        audio.autoplay = true;
        audio.volume = userVolumes[userId || producerId] ?? savedVolume;
        audioRefs.current.set(producerId, audio);
        document.body.appendChild(audio);
      }
    });

    const activeProducers = consumers.map((c) => c.producerId);
    audioRefs.current.forEach((audio, producerId) => {
      if (!activeProducers.includes(producerId)) {
        audio.pause();
        audio.remove();
        audioRefs.current.delete(producerId);
      }
    });

    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.remove();
      });
      audioRefs.current.clear();
    };
  }, [consumers]);

  useEffect(() => {
    audioRefs.current.forEach((audio, producerId) => {
      const userId = producerToUserMap.current.get(producerId);

      if (userId && userVolumes[userId] !== undefined) {
        audio.volume = userVolumes[userId];
      }
    });
  }, [userVolumes]);

  const setVolume = (userId: string, volume: number) => {
    setUserVolumes((prev) => ({ ...prev, [userId]: volume / 100 }));
    saveVolumeToStorage(userId, volume / 100);
  };

  const registerProducerUser = (producerId: string, userId: string) => {
    producerToUserMap.current.set(producerId, userId);

    setUserVolumes((prev) => {
      if (prev[userId] === undefined) {
        const storedVolume = getStoredVolume(userId);

        return { ...prev, [userId]: storedVolume };
      }

      return prev;
    });
  };

  return (
    <AudioContext.Provider
      value={{
        setVolume,
        registerProducerUser,
        userVolumes,
      }}
    >
      {props.children}
    </AudioContext.Provider>
  );
};
