import { useAppSelector } from '~/hooks';

export const useChannelSettings = () => {
  const { currentChannelId, currentNotificationChannelId, serverData } =
    useAppSelector((state) => state.testServerStore);

  const channelSettings = serverData.channels.textChannels.find(
    (channel) => channel.channelId === currentChannelId,
  );

  const notificationChannelSettings =
    serverData.channels.notificationChannels.find(
      (channel) => channel.channelId === currentNotificationChannelId,
    );

  return {
    canWrite: currentChannelId
      ? channelSettings?.canWrite
      : notificationChannelSettings?.canWrite,
    canWriteSub: currentChannelId ? channelSettings?.canWriteSub : false,
    nonReadedCount: currentChannelId
      ? channelSettings?.nonReadedCount
      : notificationChannelSettings?.nonReadedCount,
    nonReadedTaggedCount: currentChannelId
      ? channelSettings?.nonReadedTaggedCount
      : notificationChannelSettings?.nonReadedTaggedCount,
  };
};
