import { Modal, Stack, TextInput, Button, Group } from '@mantine/core';
import { useState } from 'react';

import { createChat } from '~/entities/chat';
import { useAppDispatch, useNotification } from '~/hooks';

interface CreateChatProps {
  opened: boolean;
  onClose: () => void;
}

export const CreateChat = ({ opened, onClose }: CreateChatProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const [userTag, setUserTag] = useState('');

  const handleCreateChat = async () => {
    const result = await dispatch(createChat({ userTag }));

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Чат успешно создан');
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Создание чата"
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
          <Button onClick={handleCreateChat}>Создать</Button>
        </Group>
      </Stack>
    </Modal>
  );
};
