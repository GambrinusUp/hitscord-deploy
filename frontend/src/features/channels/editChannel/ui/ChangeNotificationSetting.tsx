import { Switch } from '@mantine/core';
import { Bell, BellOff } from 'lucide-react';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { changeChannelNotifiable } from '~/store/ServerStore';

interface ChangeNotificationSettingProps {
  channelId: string;
}

export const ChangeNotificationSetting = ({
  channelId,
}: ChangeNotificationSettingProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { serverData } = useAppSelector((state) => state.testServerStore);
  const textChannel = serverData.channels.textChannels.find(
    (channel) => channel.channelId === channelId,
  );
  const notificationChannel = serverData.channels.notificationChannels.find(
    (channel) => channel.channelId === channelId,
  );

  const getNotifiable = (): boolean => {
    if (textChannel) {
      return textChannel.isNotifiable;
    }

    if (notificationChannel) {
      return notificationChannel.isNotifiable;
    }

    return false;
  };

  const isNotifiable = getNotifiable();

  const changeSetting = async () => {
    const result = await dispatch(
      changeChannelNotifiable({
        channelId,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Настройка успешно изменилась');
    }
  };

  return (
    <Switch
      checked={isNotifiable}
      onChange={changeSetting}
      color="teal"
      size="md"
      label={isNotifiable ? 'Уведомления приходят' : 'Уведомления не приходят'}
      thumbIcon={
        isNotifiable ? (
          <Bell size={12} color="var(--mantine-color-teal-6)" />
        ) : (
          <BellOff size={12} color="var(--mantine-color-red-6)" />
        )
      }
    />
  );
};
