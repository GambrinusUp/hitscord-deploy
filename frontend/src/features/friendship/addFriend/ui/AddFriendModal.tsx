import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';

import { createApplication } from '~/entities/friendship';
import { useAppDispatch, useNotification } from '~/hooks';

interface AddFriendModalProps {
  opened: boolean;
  close: () => void;
}

export const AddFriendModal = ({ opened, close }: AddFriendModalProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const [userTag, setUserTag] = useState('');

  const handleAddUserInChat = async () => {
    const result = await dispatch(
      createApplication({
        userTag: userTag.trim(),
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Пользователь успешно добавлен');
      close();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      title="Добавление друга"
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
