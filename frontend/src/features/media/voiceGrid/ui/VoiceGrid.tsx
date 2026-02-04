import { ActionIcon, Group, ScrollArea, SimpleGrid } from '@mantine/core';
import { ArrowLeftFromLine } from 'lucide-react';
import { useCallback } from 'react';

import { useMediaContext } from '~/context';
import { VoiceUserCard } from '~/entities/media';
import { getUserGroups } from '~/helpers';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { useSpeaking } from '~/shared/lib/hooks';
import { toggleUserStreamView } from '~/store/AppStore';

export const VoiceGrid = () => {
  const dispatch = useAppDispatch();
  const { users, setSelectedUserId, previewUserIds, togglePreview, consumers } =
    useMediaContext();
  const { calculateIsSpeaking, getIsMuted } = useSpeaking();
  const { currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );

  const rooms = getUserGroups(users);
  const currentRoom = rooms.find(
    (room) => room.roomName === currentVoiceChannelId,
  );

  const handleOpenStream = useCallback(
    (socketId: string) => {
      setSelectedUserId(socketId);
    },
    [setSelectedUserId],
  );

  const handlePreviewStream = useCallback(
    (socketId: string) => {
      togglePreview(socketId);
    },
    [togglePreview],
  );

  const handleBack = useCallback(() => {
    dispatch(toggleUserStreamView());
  }, [dispatch]);

  return (
    <ScrollArea style={{ flex: 1, maxHeight: '100%' }}>
      <Group justify="flex-end">
        <ActionIcon variant="transparent" onClick={handleBack}>
          <ArrowLeftFromLine />
        </ActionIcon>
      </Group>
      <SimpleGrid cols={{ base: 2, lg: 3 }} spacing="sm">
        {currentRoom &&
          Object.entries(currentRoom.users).map(
            ([socketId, { userName, userId, producers }]) => {
              const isStreaming = !!producers.find(
                (producer) => producer.source === 'screen-video',
              );
              const producerIds = producers.map(
                (producer) => producer.producerId,
              );
              const isSpeaking = calculateIsSpeaking(
                producerIds,
                currentVoiceChannelId!,
              );
              const isMuted = getIsMuted(userId);
              const isPreviewActive = previewUserIds.has(socketId);
              const isCameraEnabled = !!producers.find(
                (producer) => producer.source === 'camera',
              );

              return (
                <VoiceUserCard
                  key={socketId}
                  socketId={socketId}
                  userName={userName}
                  userId={userId}
                  isStreaming={isStreaming}
                  onOpenStream={handleOpenStream}
                  onPreviewStream={handlePreviewStream}
                  isMuted={isMuted}
                  isSpeaking={isSpeaking}
                  isPreviewActive={isPreviewActive}
                  consumers={consumers}
                  userProducerIds={producerIds}
                  isCameraEnabled={isCameraEnabled}
                />
              );
            },
          )}
      </SimpleGrid>
    </ScrollArea>
  );
};
