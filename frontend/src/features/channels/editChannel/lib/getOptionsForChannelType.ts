import { ChannelType } from '~/store/ServerStore';

export const getOptionsForChannelType = (type: ChannelType) => {
  switch (type) {
    case ChannelType.TEXT_CHANNEL:
      return [
        { value: '0', label: 'Видеть' },
        { value: '2', label: 'Писать' },
        { value: '3', label: 'Создавать подчаты' },
      ];

    case ChannelType.NOTIFICATION_CHANNEL:
      return [
        {
          value: '0',
          label: 'Видеть',
        },
        { value: '2', label: 'Писать' },
        { value: '5', label: 'Получать уведомления' },
      ];

    case ChannelType.VOICE_CHANNEL:
      return [
        { value: '0', label: 'Видеть' },
        { value: '1', label: 'Присоединиться' },
      ];

    default:
      return [];
  }
};
