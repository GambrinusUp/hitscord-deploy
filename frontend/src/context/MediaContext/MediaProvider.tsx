import {
  Consumer,
  Device,
  Producer,
  Transport,
} from 'mediasoup-client/lib/types';
import { useEffect, useState } from 'react';

import { MediaContext } from './MediaContext';

import { socket } from '~/api/socket';
import { signalNewConsumerTransport } from '~/context/utils';
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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [previewUserIds, setPreviewUserIds] = useState<Set<string>>(new Set());
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
        signalNewConsumerTransport(producerId, device, addConsumer);
      }
    });

    socket.on('updateUsersList', ({ rooms }) => {
      console.log(rooms);
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
  }, [device]);

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
      }}
    >
      {props.children}
    </MediaContext.Provider>
  );
};
