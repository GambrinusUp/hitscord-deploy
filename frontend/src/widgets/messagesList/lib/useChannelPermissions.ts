import { useAppSelector } from '~/hooks';

export const useChannelPermissions = () => {
  const { serverData, currentChannelId, currentNotificationChannelId } =
    useAppSelector((state) => state.testServerStore);

  const getCanWrite = () => {
    if (currentChannelId) {
      const channel = serverData.channels.textChannels.find(
        (channel) => channel.channelId === currentChannelId,
      );

      return channel ? channel.canWrite : false;
    }

    if (currentNotificationChannelId) {
      const channel = serverData.channels.notificationChannels.find(
        (channel) => channel.channelId === currentNotificationChannelId,
      );

      return channel ? channel.canWrite : false;
    }

    return true;
  };

  return {
    canWrite: getCanWrite(),
  };
};
