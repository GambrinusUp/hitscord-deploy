import { useAppSelector } from '~/hooks';

export const useChannelData = () => {
  const messages = useAppSelector((state) => state.testServerStore.messages);
  const messagesStatus = useAppSelector(
    (state) => state.testServerStore.messageIsLoading,
  );
  const remainingTopMessagesCount = useAppSelector(
    (state) => state.testServerStore.remainingTopMessagesCount,
  );
  const lastTopMessageId = useAppSelector(
    (state) => state.testServerStore.lastTopMessageId,
  );
  const remainingBottomMessagesCount = useAppSelector(
    (state) => state.testServerStore.remainingBottomMessagesCount,
  );
  const lastBottomMessageId = useAppSelector(
    (state) => state.testServerStore.lastBottomMessageId,
  );
  const startMessageId = useAppSelector(
    (state) => state.testServerStore.startMessageId,
  );
  const allMessagesCount = useAppSelector(
    (state) => state.testServerStore.allMessagesCount,
  );
  /*const entityId = useAppSelector(
    (state) =>
      state.testServerStore.currentChannelId ??
      state.testServerStore.currentNotificationChannelId,
  );*/
  const textChannels = useAppSelector(
    (state) => state.testServerStore.serverData.channels.textChannels,
  );
  const currentChannelId = useAppSelector(
    (state) => state.testServerStore.currentChannelId,
  );
  const currentNotificationChannelId = useAppSelector(
    (state) => state.testServerStore.currentNotificationChannelId,
  );

  const entityId = currentChannelId ?? currentNotificationChannelId;

  const getLastReadedMessageId = () => {
    if (currentChannelId) {
      const textChannel = textChannels.find(
        (channel) => channel.channelId === currentChannelId,
      );

      return textChannel?.lastReadedMessageId || 0;
    }

    if (currentNotificationChannelId) {
      const notificationChannel = textChannels.find(
        (channel) => channel.channelId === currentNotificationChannelId,
      );

      return notificationChannel?.lastReadedMessageId || 0;
    }

    return 0;
  };

  return {
    messages,
    messagesStatus,
    remainingTopMessagesCount,
    lastTopMessageId,
    remainingBottomMessagesCount,
    lastBottomMessageId,
    startMessageId,
    allMessagesCount,
    entityId,
    lastReadedMessageId: getLastReadedMessageId(),
  };
};
