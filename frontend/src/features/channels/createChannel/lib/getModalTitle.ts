import { ChannelType } from '~/store/ServerStore';

export const getModalTitle = (channelType: ChannelType) => {
  switch (channelType) {
    case ChannelType.TEXT_CHANNEL:
      return 'Создание текстового канала';
    case ChannelType.VOICE_CHANNEL:
      return 'Создание голосового канала';
    case ChannelType.NOTIFICATION_CHANNEL:
      return 'Создание канала для оповещений';
    default:
      return 'Создание канала';
  }
};
