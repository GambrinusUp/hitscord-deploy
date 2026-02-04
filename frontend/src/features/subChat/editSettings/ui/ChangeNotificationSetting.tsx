import { Switch } from '@mantine/core';
import { Bell, BellOff } from 'lucide-react';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { changeChannelNotifiable } from '~/store/ServerStore';

export const ChangeNotificationSetting = () => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { currentSubChatId, subChatInfo } = useAppSelector(
    (state) => state.subChatStore,
  );

  const isNotifiable = subChatInfo?.isNotifiable;

  const changeSetting = async () => {
    const result = await dispatch(
      changeChannelNotifiable({
        channelId: currentSubChatId!,
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
