import { ChannelType } from '~/store/ServerStore';

export const getOptionsForChannelType = (type: ChannelType) => {
  switch (type) {
    case ChannelType.TEXT_CHANNEL:
      return [
        { value: 0, label: 'Видеть', key: 'canSee' },
        { value: 2, label: 'Писать', key: 'canWrite' },
        { value: 3, label: 'Создавать подчаты', key: 'canWriteSub' },
      ];

    case ChannelType.NOTIFICATION_CHANNEL:
      return [
        { value: 0, label: 'Видеть', key: 'canSee' },
        { value: 2, label: 'Писать', key: 'canWrite' },
        { value: 5, label: 'Получать уведомления', key: 'notificated' },
      ];

    case ChannelType.VOICE_CHANNEL:
      return [
        { value: 0, label: 'Видеть', key: 'canSee' },
        { value: 1, label: 'Присоединиться', key: 'canJoin' },
      ];

    default:
      return [];
  }
};
