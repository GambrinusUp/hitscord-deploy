import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';

import { addUserInChat } from '~/entities/chat';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';

interface AddUserToChatModalProps {
  opened: boolean;
  close: () => void;
}

export const AddUserToChatModal = ({
  opened,
  close,
}: AddUserToChatModalProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const [userTag, setUserTag] = useState('');

  const handleAddUserInChat = async () => {
    if (activeChat) {
      const result = await dispatch(
        addUserInChat({
          chatId: activeChat,
          userTag: userTag.trim(),
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Пользователь успешно добавлен');
        close();
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      title="Добавление пользователя"
      styles={{
        content: { backgroundColor: '#2c2e33', color: '#ffffff' },
        header: { backgroundColor: '#2c2e33' },
      }}
    >
      <Stack gap="md">
        <TextInput
          label="Введите usertag"
          placeholder="usertag#000000"
          value={userTag}
          onChange={(event) => setUserTag(event.currentTarget.value)}
        />
        <Group justify="flex-end">
          <Button onClick={handleAddUserInChat}>Добавить</Button>
        </Group>
      </Stack>
    </Modal>
  );
};
