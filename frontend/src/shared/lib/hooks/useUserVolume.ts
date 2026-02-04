import { MediaKind } from 'mediasoup-client/lib/types';

import { useAudioContext, useMediaContext } from '~/context';
import { RoomGroup } from '~/helpers/types';
import { useAppSelector } from '~/hooks';

export const useUserVolume = (rooms: RoomGroup[]) => {
  const { currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { consumers } = useMediaContext();
  const { setVolume, userVolumes } = useAudioContext();

  const handleVolumeChange = (
    socketId: string,
    value: number,
    kind: MediaKind,
  ) => {
    if (!currentVoiceChannelId) return;

    const room = rooms.find((room) => room.roomName === currentVoiceChannelId);

    if (!room) return;

    const user = room.users[socketId];

    if (!user) return;

    const audioProducerId = user.producers
      .map((producer) => producer.producerId)
      .find((producerId) => {
        const consumer = consumers.find(
          (c) => c.producerId === producerId && c.kind === kind,
        );

        return !!consumer;
      });

    if (audioProducerId) {
      setVolume(audioProducerId, value);
    }
  };

  const calculateSliderValue = (producerIds: string[]) => {
    const audioProducerId = producerIds.find((id) =>
      consumers.some((c) => c.producerId === id && c.kind === 'audio'),
    );

    return (userVolumes[audioProducerId || ''] || 1) * 100;
  };

  return {
    handleVolumeChange,
    calculateSliderValue,
  };
};
