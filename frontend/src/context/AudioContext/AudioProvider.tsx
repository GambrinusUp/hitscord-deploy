import { useEffect, useRef, useState } from 'react';

import { AudioContext as CustomAudioContext } from './AudioContext';

import { useMediaContext } from '~/context/MediaContext';
import { getStoredVolume } from '~/shared/lib/utils/getStoredVolume';
import { saveVolumeToStorage } from '~/shared/lib/utils/saveVolumeToStorage';

export const AudioProvider = (props: React.PropsWithChildren) => {
  const { consumers } = useMediaContext();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef(
    new Map<string, { source: MediaStreamAudioSourceNode; gain: GainNode }>(),
  );
  const [userVolumes, setUserVolumes] = useState<Record<string, number>>({});
  const producerToUserMap = useRef(new Map<string, string>());
  const [audioState, setAudioState] = useState<AudioContextState>('suspended');

  const allRemoteStreamRef = useRef(new MediaStream());
  const mutedAudioRef = useRef<HTMLAudioElement | null>(null);
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const destRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const pendingTrackRemovals = useRef<Set<string>>(new Set());
  const trackAdditionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resumeAudio = async () => {
    // Clean up previous audio context if it's closed
    if (audioCtxRef.current?.state === 'closed') {
      audioCtxRef.current = null;

      // Also reset audio elements to avoid stale references
      if (mutedAudioRef.current) {
        mutedAudioRef.current.pause();
        mutedAudioRef.current.srcObject = null;
        mutedAudioRef.current = null;
      }

      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
        mainAudioRef.current.srcObject = null;
        mainAudioRef.current = null;
      }
      // Reset destination
      destRef.current = null;
    }

    if (!audioCtxRef.current) {
      const audioContextCtor =
        window.AudioContext ||
        (
          window as Window &
            typeof globalThis & { webkitAudioContext?: typeof AudioContext }
        ).webkitAudioContext;

      if (!audioContextCtor) {
        console.error('Web Audio API is not supported in this browser');

        return;
      }

      audioCtxRef.current = new audioContextCtor();

      audioCtxRef.current.addEventListener('statechange', () => {
        setAudioState(audioCtxRef.current?.state || 'closed');
      });
      destRef.current = audioCtxRef.current.createMediaStreamDestination();
    }

    if (!mutedAudioRef.current) {
      mutedAudioRef.current = document.createElement('audio');
      mutedAudioRef.current.muted = true;
      mutedAudioRef.current.autoplay = true;
      mutedAudioRef.current.setAttribute('playsinline', 'true');
      document.body.appendChild(mutedAudioRef.current);
    }

    if (!mainAudioRef.current) {
      mainAudioRef.current = document.createElement('audio');
      mainAudioRef.current.autoplay = true;
      mainAudioRef.current.setAttribute('playsinline', 'true');
      mainAudioRef.current.srcObject = destRef.current?.stream || null;
      mainAudioRef.current.volume = 1;
      document.body.appendChild(mainAudioRef.current);
    }

    if (audioCtxRef.current.state === 'suspended') {
      try {
        await audioCtxRef.current.resume();

        if (mainAudioRef.current) {
          mainAudioRef.current
            .play()
            .catch((e) => console.error('Main audio play error:', e));
        }
      } catch (error) {
        console.error('Failed to resume AudioContext:', error);
      }
    }
  };

  useEffect(() => {
    // Handle transitions between channels
    if (consumers.length === 0) {
      // User left the channel - mark that we need fresh setup on re-entry
      // Don't close AudioContext yet, just mark state
      if (nodesRef.current.size === 0 && audioCtxRef.current?.state === 'running') {
        // AudioContext will be reused, but streams may need reset
        if (allRemoteStreamRef.current) {
          allRemoteStreamRef.current.getTracks().forEach(track => {
            allRemoteStreamRef.current.removeTrack(track);
          });
        }
      }
    } else if (consumers.length > 0) {
      // User entered a channel
      if (!audioCtxRef.current) {
        resumeAudio();
      } else if (audioCtxRef.current.state === 'closed') {
        // AudioContext was closed, need to create a new one
        audioCtxRef.current = null;
        resumeAudio();
      }
    }
  }, [consumers.length]);

  useEffect(() => {
    if (
      !audioCtxRef.current ||
      audioCtxRef.current.state !== 'running' ||
      !destRef.current
    ) {
      return;
    }

    const audioCtx = audioCtxRef.current;
    const destination = destRef.current;
    const allRemoteStream = allRemoteStreamRef.current;
    let needsSrcObjectReset = false;

    consumers.forEach(({ producerId, track, kind, appData }) => {
      if (
        nodesRef.current.has(producerId) ||
        pendingTrackRemovals.current.has(producerId)
      ) {
        return;
      }

      const sourceType = appData?.source;

      if (kind === 'audio' && sourceType !== 'screen-audio') {
        track.contentHint = 'speech';

        allRemoteStream.addTrack(track);
        needsSrcObjectReset = true;

        const mediaStream = new MediaStream([track]);

        let sourceNode: MediaStreamAudioSourceNode;
        try {
          sourceNode = audioCtx.createMediaStreamSource(mediaStream);
        } catch (e) {
          console.error('Failed to create MediaStreamAudioSourceNode:', e);
          allRemoteStream.removeTrack(track);
          needsSrcObjectReset = true;

          return;
        }

        const gainNode = audioCtx.createGain();
        const userId = producerToUserMap.current.get(producerId);
        const volumeKey = userId ?? producerId;
        gainNode.gain.value =
          userVolumes[volumeKey] ?? getStoredVolume(volumeKey) ?? 1;

        sourceNode.connect(gainNode);
        gainNode.connect(destination);

        nodesRef.current.set(producerId, {
          source: sourceNode,
          gain: gainNode,
        });
      }
    });

    const activeProducers = new Set(consumers.map((c) => c.producerId));
    const producersToRemove: string[] = [];

    nodesRef.current.forEach((_, producerId) => {
      if (
        !activeProducers.has(producerId) &&
        !pendingTrackRemovals.current.has(producerId)
      ) {
        producersToRemove.push(producerId);
      }
    });

    if (producersToRemove.length > 0) {
      producersToRemove.forEach((producerId) => {
        pendingTrackRemovals.current.add(producerId);

        const nodes = nodesRef.current.get(producerId);
        const producer = consumers.find((c) => c.producerId === producerId);

        if (nodes && producer) {
          const fadeOutDuration = 0.2;
          const currentTime = audioCtx.currentTime;
          nodes.gain.gain.setValueAtTime(nodes.gain.gain.value, currentTime);
          nodes.gain.gain.linearRampToValueAtTime(
            0,
            currentTime + fadeOutDuration,
          );

          setTimeout(
            () => {
              nodes.gain.disconnect();
              nodes.source.disconnect();
              nodesRef.current.delete(producerId);
              pendingTrackRemovals.current.delete(producerId);

              allRemoteStream.removeTrack(producer.track);

              if (mutedAudioRef.current) {
                mutedAudioRef.current.srcObject = new MediaStream(
                  allRemoteStream.getTracks(),
                );
              }
            },
            fadeOutDuration * 1000 + 10,
          );
        }
      });
    }

    if (needsSrcObjectReset && mutedAudioRef.current) {
      mutedAudioRef.current.srcObject = allRemoteStream;

      if (mainAudioRef.current) {
        mainAudioRef.current
          .play()
          .catch((e) => console.error('Main audio play error:', e));
      }
    }

    // Cleanup when exiting channel
    return () => {
      if (consumers.length === 0) {
        // Clear any pending track removals when leaving channel
        pendingTrackRemovals.current.clear();
        
        // Stop trying to add more tracks
        if (trackAdditionTimeoutRef.current) {
          clearTimeout(trackAdditionTimeoutRef.current);
          trackAdditionTimeoutRef.current = null;
        }
      }
    };
  }, [consumers, audioState, userVolumes]);

  useEffect(() => {
    nodesRef.current.forEach(({ gain }, producerId) => {
      const userId = producerToUserMap.current.get(producerId);
      const volumeKey = userId ?? producerId;

      if (userVolumes[volumeKey] !== undefined) {
        gain.gain.value = userVolumes[volumeKey];
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

  useEffect(() => {
    return () => {
      if (trackAdditionTimeoutRef.current) {
        clearTimeout(trackAdditionTimeoutRef.current);
      }

      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      nodesRef.current.forEach(({ gain, source }) => {
        gain.disconnect();
        source.disconnect();
      });
      nodesRef.current.clear();
      pendingTrackRemovals.current.clear();

      if (mutedAudioRef.current) {
        mutedAudioRef.current.pause();
        mutedAudioRef.current.srcObject = null;
        mutedAudioRef.current.remove();
        mutedAudioRef.current = null;
      }

      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
        mainAudioRef.current.srcObject = null;
        mainAudioRef.current.remove();
        mainAudioRef.current = null;
      }
      allRemoteStreamRef.current = new MediaStream();
      destRef.current = null;
    };
  }, []);

  return (
    <CustomAudioContext.Provider
      value={{
        setVolume,
        registerProducerUser,
        userVolumes,
        resumeAudio,
      }}
    >
      {props.children}
    </CustomAudioContext.Provider>
  );
};
