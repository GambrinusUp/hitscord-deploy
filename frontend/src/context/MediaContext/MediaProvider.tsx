import {
  Consumer,
  Device,
  Producer,
  Transport,
} from 'mediasoup-client/lib/types';
import { useCallback, useEffect, useRef, useState } from 'react';

import { MediaContext } from './MediaContext';

import { socket } from '~/api/socket';
import {
  calculateMicGain,
  getDefaultMicSettings,
  getLocalAudioStream,
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
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>(
    [],
  );
  const [audioOutputDevices, setAudioOutputDevices] = useState<
    MediaDeviceInfo[]
  >([]);
  const [micSettings, setMicSettings] = useState<MicSettings>(() => {
    const fallback = getDefaultMicSettings();

    if (typeof localStorage === 'undefined') return fallback;

    try {
      const stored = localStorage.getItem('micSettings');

      if (!stored) return fallback;

      const parsed = JSON.parse(stored) as Partial<MicSettings>;
      const normalizedInputDeviceId =
        parsed.inputDeviceId && parsed.inputDeviceId.length > 0
          ? parsed.inputDeviceId
          : null;

      return {
        ...fallback,
        ...parsed,
        inputDeviceId: normalizedInputDeviceId,
      };
    } catch {
      return fallback;
    }
  });
  const [selectedOutputDeviceId, setSelectedOutputDeviceId] = useState<
    string | null
  >(() => {
    if (typeof localStorage === 'undefined') return null;

    const storedOutputDeviceId = localStorage.getItem('selectedOutputDeviceId');

    return storedOutputDeviceId && storedOutputDeviceId.length > 0
      ? storedOutputDeviceId
      : null;
  });
  const micAudioStateRef = useRef<MicAudioState | null>(null);
  const micSettingsRef = useRef<MicSettings>(micSettings);
  const selectedOutputDeviceIdRef = useRef<string | null>(
    selectedOutputDeviceId,
  );
  const micMonitorAudioRef = useRef<HTMLAudioElement | null>(null);
  const micMonitorStreamRef = useRef<MediaStream | null>(null);
  const micMonitorRequestRef = useRef<Promise<void> | null>(null);
  const dispatch = useAppDispatch();
  const { currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { accessToken } = useAppSelector((state) => state.userStore);

  const areDeviceListsEqual = (
    prev: MediaDeviceInfo[],
    next: MediaDeviceInfo[],
  ) => {
    if (prev.length !== next.length) return false;

    return prev.every((prevDevice, index) => {
      const nextDevice = next[index];

      return (
        prevDevice.deviceId === nextDevice.deviceId &&
        prevDevice.groupId === nextDevice.groupId &&
        prevDevice.kind === nextDevice.kind &&
        prevDevice.label === nextDevice.label
      );
    });
  };

  const addConsumer = useCallback((consumer: Consumer) => {
    setConsumers((prev) => [...prev, consumer]);
  }, []);

  const togglePreview = useCallback((socketId: string) => {
    setPreviewUserIds((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(socketId)) {
        newSet.delete(socketId);
      } else {
        newSet.add(socketId);
      }

      return newSet;
    });
  }, []);

  const toggleMute = useCallback(() => {
    if (audioProducer) {
      if (isMuted) {
        audioProducer.resume();
      } else {
        audioProducer.pause();
      }
      dispatch(selfMute());
      setIsMuted(!isMuted);
    }
  }, [audioProducer, dispatch, isMuted]);

  const stopMicAudioState = (state: MicAudioState) => {
    state.processedTrack.stop();
    state.rawTrack.stop();
    state.audioContext.close().catch(() => undefined);
  };

  const setMicAudioState = useCallback((state: MicAudioState | null) => {
    if (micAudioStateRef.current) {
      stopMicAudioState(micAudioStateRef.current);
    }

    micAudioStateRef.current = state;
    syncMicMonitoring();
  }, []);

  const clearMicAudioState = useCallback(() => {
    if (!micAudioStateRef.current) return;

    stopMicAudioState(micAudioStateRef.current);
    micAudioStateRef.current = null;
    syncMicMonitoring();
  }, []);

  const refreshAudioDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const nextInputDevices = devices.filter(
        (device) => device.kind === 'audioinput',
      );
      const nextOutputDevices = devices.filter(
        (device) => device.kind === 'audiooutput',
      );

      setAudioInputDevices((prev) =>
        areDeviceListsEqual(prev, nextInputDevices) ? prev : nextInputDevices,
      );
      setAudioOutputDevices((prev) =>
        areDeviceListsEqual(prev, nextOutputDevices) ? prev : nextOutputDevices,
      );
    } catch (error) {
      console.error('Failed to enumerate audio devices:', error);
    }
  }, []);

  const switchInputDevice = useCallback(
    async (deviceId: string | null) => {
      const nextSettings = {
        ...micSettings,
        inputDeviceId: deviceId,
      };
      setMicSettings(nextSettings);

      if (!isConnected || !audioProducer) return;

      let nextMicAudioState: MicAudioState | null = null;

      try {
        nextMicAudioState = await getLocalAudioStream(nextSettings);

        await audioProducer.replaceTrack({
          track: nextMicAudioState?.processedTrack ?? null,
        });

        setMicAudioState(nextMicAudioState);
      } catch (error) {
        console.error('Failed to switch input device:', error);

        if (nextMicAudioState) {
          stopMicAudioState(nextMicAudioState);
        }
      }
    },
    [audioProducer, isConnected, micSettings, setMicAudioState],
  );

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
  }, [
    accessToken,
    addConsumer,
    consumerTransport,
    currentVoiceChannelId,
    device,
  ]);

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;

    localStorage.setItem('micSettings', JSON.stringify(micSettings));
  }, [micSettings]);

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;

    if (!selectedOutputDeviceId) {
      localStorage.removeItem('selectedOutputDeviceId');

      return;
    }

    localStorage.setItem('selectedOutputDeviceId', selectedOutputDeviceId);
  }, [selectedOutputDeviceId]);

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

  useEffect(() => {
    micSettingsRef.current = micSettings;
    selectedOutputDeviceIdRef.current = selectedOutputDeviceId;
    syncMicMonitoring();
  }, [micSettings, selectedOutputDeviceId]);

  useEffect(() => {
    refreshAudioDevices();

    if (!navigator.mediaDevices?.addEventListener) return;

    navigator.mediaDevices.addEventListener(
      'devicechange',
      refreshAudioDevices,
    );

    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        refreshAudioDevices,
      );
    };
  }, [refreshAudioDevices]);

  const applyOutputDevice = async (
    audioElement: HTMLAudioElement | null,
    outputDeviceId: string | null,
  ) => {
    if (!audioElement) return;

    const outputElement = audioElement as HTMLAudioElement & {
      setSinkId?: (sinkId: string) => Promise<void>;
    };

    if (typeof outputElement.setSinkId !== 'function') return;

    try {
      await outputElement.setSinkId(outputDeviceId ?? '');
    } catch (error) {
      console.error('Failed to set mic monitor output device:', error);
    }
  };

  const ensureMicForMonitoring = () => {
    if (micAudioStateRef.current) return;

    if (micMonitorRequestRef.current) return;

    micMonitorRequestRef.current = (async () => {
      try {
        const nextMicAudioState = await getLocalAudioStream(
          micSettingsRef.current,
        );

        if (nextMicAudioState) {
          setMicAudioState(nextMicAudioState);
        }
      } catch (error) {
        console.error('Failed to get mic stream for monitoring:', error);
      } finally {
        micMonitorRequestRef.current = null;
      }
    })();
  };

  const syncMicMonitoring = () => {
    const settings = micSettingsRef.current;
    const micAudioState = micAudioStateRef.current;

    if (!settings.monitoringEnabled) {
      if (micMonitorAudioRef.current) {
        micMonitorAudioRef.current.pause();
        micMonitorAudioRef.current.srcObject = null;
      }
      micMonitorStreamRef.current = null;

      return;
    }

    if (!micAudioState) {
      ensureMicForMonitoring();

      return;
    }

    if (!micMonitorAudioRef.current) {
      micMonitorAudioRef.current = document.createElement('audio');
      micMonitorAudioRef.current.autoplay = true;
      micMonitorAudioRef.current.setAttribute('playsinline', 'true');
      document.body.appendChild(micMonitorAudioRef.current);
    }

    const stream = new MediaStream([micAudioState.processedTrack]);
    micMonitorStreamRef.current = stream;
    micMonitorAudioRef.current.srcObject = stream;
    micMonitorAudioRef.current.volume = 1;
    applyOutputDevice(
      micMonitorAudioRef.current,
      selectedOutputDeviceIdRef.current,
    );
    micMonitorAudioRef.current
      .play()
      .catch((e) => console.error('Mic monitor play error:', e));
  };

  useEffect(() => {
    return () => {
      if (micMonitorAudioRef.current) {
        micMonitorAudioRef.current.pause();
        micMonitorAudioRef.current.srcObject = null;
        micMonitorAudioRef.current.remove();
        micMonitorAudioRef.current = null;
      }
      micMonitorStreamRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isConnected) return;

    if (micSettings.monitoringEnabled) return;

    if (!micAudioStateRef.current) return;

    clearMicAudioState();
  }, [clearMicAudioState, isConnected, micSettings.monitoringEnabled]);

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
        audioInputDevices,
        audioOutputDevices,
        selectedOutputDeviceId,
        setSelectedOutputDeviceId,
        refreshAudioDevices,
        switchInputDevice,
        setMicAudioState,
        clearMicAudioState,
      }}
    >
      {props.children}
    </MediaContext.Provider>
  );
};
