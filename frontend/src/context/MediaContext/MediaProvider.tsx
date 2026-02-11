import {
  Consumer,
  Device,
  Producer,
  Transport,
} from 'mediasoup-client/lib/types';
import { useEffect, useRef, useState } from 'react';

import { MediaContext } from './MediaContext';

import { socket } from '~/api/socket';
import {
  calculateMicGain,
  getDefaultMicSettings,
  MicAudioState,
  MicSettings,
  signalNewConsumerTransport,
} from '~/context/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { Room } from '~/shared/types';
import { selfMute } from '~/store/ServerStore';

export const MediaProvider = (props: React.PropsWithChildren) => {
  //проверить стрим экрана при включении и отключении микрофона, при подключении новых пользователей
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isUserMute, setIsUserMute] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [users, setUsers] = useState<Room[]>([]);
  const [device, setDevice] = useState<Device | null>(null);
  const [audioProducer, setAudioProducer] = useState<Producer | null>(null);
  const [videoProducer, setVideoProducer] = useState<Producer | null>(null);
  const [videoAudioProducer, setVideoAudioProducer] = useState<Producer | null>(
    null,
  );
  const [producerTransport, setProducerTransport] = useState<Transport | null>(
    null,
  );
  const [consumerTransport, setConsumerTransport] = useState<Transport | null>(
    null,
  );
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [previewUserIds, setPreviewUserIds] = useState<Set<string>>(new Set());
  const [micSettings, setMicSettings] = useState<MicSettings>(() => {
    const fallback = getDefaultMicSettings();

    if (typeof localStorage === 'undefined') return fallback;

    try {
      const stored = localStorage.getItem('micSettings');

      if (!stored) return fallback;

      const parsed = JSON.parse(stored) as Partial<MicSettings>;

      return {
        ...fallback,
        ...parsed,
      };
    } catch {
      return fallback;
    }
  });
  const micAudioStateRef = useRef<MicAudioState | null>(null);
  const dispatch = useAppDispatch();
  const { currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { accessToken } = useAppSelector((state) => state.userStore);

  const addConsumer = (consumer: Consumer) => {
    setConsumers((prev) => [...prev, consumer]);
  };

  const togglePreview = (socketId: string) => {
    setPreviewUserIds((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(socketId)) {
        newSet.delete(socketId);
      } else {
        newSet.add(socketId);
      }

      return newSet;
    });
  };

  const toggleMute = () => {
    if (audioProducer) {
      if (isMuted) {
        audioProducer.resume();
      } else {
        audioProducer.pause();
      }
      dispatch(selfMute());
      setIsMuted(!isMuted);
    }
  };

  const stopMicAudioState = (state: MicAudioState) => {
    state.processedTrack.stop();
    state.rawTrack.stop();
    state.audioContext.close().catch(() => undefined);
  };

  const setMicAudioState = (state: MicAudioState | null) => {
    if (micAudioStateRef.current) {
      stopMicAudioState(micAudioStateRef.current);
    }

    micAudioStateRef.current = state;
  };

  const clearMicAudioState = () => {
    if (!micAudioStateRef.current) return;

    stopMicAudioState(micAudioStateRef.current);
    micAudioStateRef.current = null;
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('producerClosed', ({ producerId }) => {
      setConsumers((prev) =>
        prev.filter((consumer) => consumer.producerId !== producerId),
      );
    });

    socket.on('producer-closed', ({ remoteProducerId }) => {
      setConsumers((prevConsumers) =>
        prevConsumers.filter(
          (consumer) => consumer.producerId !== remoteProducerId,
        ),
      );
    });

    socket.on('new-producer', ({ producerId }: { producerId: string }) => {
      if (device) {
        signalNewConsumerTransport(
          producerId,
          device,
          addConsumer,
          consumerTransport,
          setConsumerTransport,
        );
      }
    });

    socket.on('updateUsersList', ({ rooms }) => {
      setUsers(rooms);
    });

    const handleBeforeUnload = () => {
      socket.emit('leaveRoom', {
        accessToken,
        voiceChannelId: currentVoiceChannelId,
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      socket.off('producerClosed');
      socket.off('producer-closed');
      socket.off('new-producer');
      socket.off('updateUsersList');
    };
  }, [device, consumerTransport]);

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;

    localStorage.setItem('micSettings', JSON.stringify(micSettings));
  }, [micSettings]);

  useEffect(() => {
    const micAudioState = micAudioStateRef.current;

    if (!micAudioState) return;

    micAudioState.gainNode.gain.value = calculateMicGain(micSettings);
    micAudioState.rawTrack
      .applyConstraints({
        noiseSuppression: micSettings.noiseSuppression,
        echoCancellation: micSettings.echoCancellation,
        autoGainControl: micSettings.autoGainControl,
      })
      .catch(() => undefined);
  }, [micSettings]);

  return (
    <MediaContext.Provider
      value={{
        isConnected,
        isMuted,
        isStreaming,
        isCameraOn,
        setIsConnected,
        setIsMuted,
        setIsStreaming,
        setIsCameraOn,
        audioProducer,
        setAudioProducer,
        videoProducer,
        setVideoProducer,
        device,
        setDevice,
        producerTransport,
        setProducerTransport,
        consumerTransport,
        setConsumerTransport,
        consumers,
        users,
        addConsumer,
        setConsumers,
        toggleMute,
        selectedUserId,
        setSelectedUserId,
        previewUserIds,
        togglePreview,
        videoAudioProducer,
        setVideoAudioProducer,
        isUserMute,
        setIsUserMute,
        micSettings,
        setMicSettings,
        setMicAudioState,
        clearMicAudioState,
      }}
    >
      {props.children}
    </MediaContext.Provider>
  );
};
