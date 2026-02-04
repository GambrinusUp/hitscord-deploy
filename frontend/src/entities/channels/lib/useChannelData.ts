import { useAppSelector } from '~/hooks';
import { ChannelType } from '~/store/ServerStore';

export const useChannelData = (channelId: string, channelType: ChannelType) => {
  const { serverData } = useAppSelector((state) => state.testServerStore);
  const textChannels = serverData.channels.textChannels;
  const notificationChannels = serverData.channels.notificationChannels;

  const getChannel = () => {
    if (channelType === ChannelType.TEXT_CHANNEL) {
      return textChannels.find((channel) => channel.channelId === channelId);
    }

    if (channelType === ChannelType.NOTIFICATION_CHANNEL) {
      return notificationChannels.find(
        (channel) => channel.channelId === channelId,
      );
    }

    return undefined;
  };

  return {
    channelData: getChannel(),
  };
};
