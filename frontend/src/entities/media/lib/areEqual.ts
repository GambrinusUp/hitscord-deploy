import { VoiceUserCardProps } from '~/entities/media/ui/VoiceUserCard';

export const areEqual = (
  prevProps: VoiceUserCardProps,
  nextProps: VoiceUserCardProps,
) => {
  const mediaPropsEqual =
    prevProps.isCameraEnabled === nextProps.isCameraEnabled &&
    prevProps.isStreaming === nextProps.isStreaming &&
    prevProps.isPreviewActive === nextProps.isPreviewActive &&
    prevProps.userName === nextProps.userName &&
    prevProps.userId === nextProps.userId &&
    prevProps.socketId === nextProps.socketId &&
    prevProps.isCompact === nextProps.isCompact;

  const prevConsumers = prevProps.consumers ?? [];
  const nextConsumers = nextProps.consumers ?? [];
  const consumersEqual =
    prevConsumers.length === nextConsumers.length &&
    prevConsumers.every(
      (consumer, index) =>
        consumer.id === nextConsumers[index]?.id &&
        consumer.producerId === nextConsumers[index]?.producerId,
    );

  const prevProducerIds = prevProps.userProducerIds ?? [];
  const nextProducerIds = nextProps.userProducerIds ?? [];
  const producerIdsEqual =
    prevProducerIds.length === nextProducerIds.length &&
    prevProducerIds.every((id, index) => id === nextProducerIds[index]);

  if (!mediaPropsEqual || !consumersEqual || !producerIdsEqual) {
    return false;
  }

  return (
    prevProps.isMuted === nextProps.isMuted &&
    prevProps.isSpeaking === nextProps.isSpeaking &&
    prevProps.onOpenStream === nextProps.onOpenStream &&
    prevProps.onPreviewStream === nextProps.onPreviewStream
  );
};
