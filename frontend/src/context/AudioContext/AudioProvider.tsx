import { useEffect, useRef, useState } from 'react';

import { AudioContext as AudioContextType } from './AudioContext';

import { useMediaContext } from '~/context/MediaContext';
import { getStoredVolume } from '~/shared/lib/utils/getStoredVolume';
import { saveVolumeToStorage } from '~/shared/lib/utils/saveVolumeToStorage';

interface AudioNode {
  source: MediaStreamAudioSourceNode;
  gainNode: GainNode;
  mediaStream: MediaStream;
}

export const AudioProvider = (props: React.PropsWithChildren) => {
  const { consumers } = useMediaContext();
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<Map<string, AudioNode>>(new Map());
  const sharedAudioRef = useRef<HTMLAudioElement | null>(null);
  const sharedStreamRef = useRef<MediaStream | null>(null);
  const [userVolumes, setUserVolumes] = useState<Record<string, number>>({});
  const producerToUserMap = useRef(new Map<string, string>());

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContextConstructor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioContextRef.current = new AudioContextConstructor();
    }

    return audioContextRef.current;
  };

  const initSharedAudio = () => {
    if (!sharedAudioRef.current) {
      const audio = document.createElement('audio');
      const stream = new MediaStream();

      audio.srcObject = stream;
      audio.autoplay = true;
      audio.muted = true;

      sharedAudioRef.current = audio;
      sharedStreamRef.current = stream;
    }

    return {
      audio: sharedAudioRef.current,
      stream: sharedStreamRef.current,
    };
  };

  useEffect(() => {
    const audioContext = initAudioContext();
    const { audio: sharedAudio, stream: sharedStream } = initSharedAudio();

    let hasNewTracks = false;

    consumers.forEach(({ producerId, track, kind, appData }) => {
      const source = appData?.source;

      if (
        kind === 'audio' &&
        source !== 'screen-audio' &&
        !audioNodesRef.current.has(producerId)
      ) {
        const userId = producerToUserMap.current.get(producerId);
        const savedVolume = userId ? getStoredVolume(userId) : 1;

        const existingTracks = sharedStream!.getTracks();

        if (!existingTracks.includes(track)) {
          sharedStream!.addTrack(track);
          hasNewTracks = true;
        }

        const singleTrackStream = new MediaStream([track]);

        const setupAudioNode = () => {
          if (audioNodesRef.current.has(producerId)) {
            return;
          }

          const audioSource =
            audioContext.createMediaStreamSource(singleTrackStream);
          const gainNode = audioContext.createGain();

          gainNode.gain.value =
            userVolumes[userId || producerId] ?? savedVolume;

          audioSource.connect(gainNode);
          gainNode.connect(audioContext.destination);

          audioNodesRef.current.set(producerId, {
            source: audioSource,
            gainNode,
            mediaStream: singleTrackStream,
          });
        };

        setTimeout(setupAudioNode, 0);
      }
    });

    if (hasNewTracks && sharedAudio.paused) {
      sharedAudio.play().catch((err) => {
        if (err.name === 'AbortError') {
          console.warn('Audio playback was interrupted, retrying...');
          setTimeout(() => {
            sharedAudio.play().catch((retryErr) => {
              console.warn('Failed to autoplay audio after retry:', retryErr);
            });
          }, 100);
        } else {
          console.warn('Failed to autoplay audio:', err);
        }
      });
    }

    const activeProducers = consumers.map((c) => c.producerId);

    audioNodesRef.current.forEach((_, producerId) => {
      if (!activeProducers.includes(producerId)) {
        const audioNode = audioNodesRef.current.get(producerId);

        if (audioNode) {
          audioNode.source.disconnect();
          audioNode.gainNode.disconnect();
        }

        audioNodesRef.current.delete(producerId);
      }
    });

    return () => {
      audioNodesRef.current.forEach((audioNode) => {
        audioNode.source.disconnect();
        audioNode.gainNode.disconnect();
      });
    };
  }, [consumers]);

  useEffect(() => {
    audioNodesRef.current.forEach((audioNode, producerId) => {
      const userId = producerToUserMap.current.get(producerId);

      if (userId && userVolumes[userId] !== undefined) {
        audioNode.gainNode.gain.value = userVolumes[userId];
      }
    });
  }, [userVolumes]);

  const setVolume = (userId: string, volume: number) => {
    const normalizedVolume = volume / 100;
    setUserVolumes((prev) => ({ ...prev, [userId]: normalizedVolume }));
    saveVolumeToStorage(userId, normalizedVolume);
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

  const resumeAudio = async () => {
    const audioContext = initAudioContext();

    if (audioContext.state === 'suspended') {
      try {
        await (audioContext as AudioContext).resume();
      } catch (err) {
        console.error('Failed to resume audio context:', err);
      }
    }
  };

  return (
    <AudioContextType.Provider
      value={{
        setVolume,
        registerProducerUser,
        userVolumes,
        resumeAudio,
      }}
    >
      {props.children}
    </AudioContextType.Provider>
  );
};
