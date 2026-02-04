import { notifications } from '@mantine/notifications';

import { NotificationMessage } from './NotificationMessage';
import { NotificationTitle } from './NotificationTitle';

import { NotificationData } from '~/entities/notifications/model/types';

export const Notification = (
  notification: NotificationData,
  closeTime: number,
) => {
  notifications.show({
    title: <NotificationTitle title={'Новое упоминание'} />,
    message: (
      <NotificationMessage
        message={notification.text}
        serverName={notification.serverName}
        channelName={notification.channelName}
      />
    ),
    position: 'top-right',
    color: 'yellow',
    radius: 'md',
    autoClose: closeTime * 1000,
  });
};
