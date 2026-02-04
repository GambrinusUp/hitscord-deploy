import { Modal, Switch } from '@mantine/core';
import { Bell, BellOff } from 'lucide-react';

import { changeChatNotifiable } from '~/entities/chat';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';

interface ChangeNotificationSettingProps {
  opened: boolean;
  onClose: () => void;
}

export const ChangeNotificationSetting = ({
  opened,
  onClose,
}: ChangeNotificationSettingProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { activeChat, chat } = useAppSelector((state) => state.chatsStore);

  const isNotifiable = chat.nonNotifiable;

  const changeSetting = async () => {
    if (!activeChat) {
      return;
    }

    const result = await dispatch(
      changeChatNotifiable({
        chatId: activeChat,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Настройка успешно изменилась');
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Настройка уведомлений"
      styles={{
        content: { backgroundColor: '#2c2e33', color: '#ffffff' },
        header: { backgroundColor: '#2c2e33' },
      }}
      size="auto"
    >
      <Switch
        checked={isNotifiable}
        onChange={changeSetting}
        color="teal"
        size="md"
        label={
          isNotifiable ? 'Уведомления приходят' : 'Уведомления не приходят'
        }
        thumbIcon={
          isNotifiable ? (
            <Bell size={12} color="var(--mantine-color-teal-6)" />
          ) : (
            <BellOff size={12} color="var(--mantine-color-red-6)" />
          )
        }
      />
    </Modal>
  );
};
