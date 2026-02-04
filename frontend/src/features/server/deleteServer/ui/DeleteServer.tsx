import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Trash } from 'lucide-react';
import { useState } from 'react';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { deleteServer } from '~/store/ServerStore';

export const DeleteServer = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { showSuccess } = useNotification();
  const dispatch = useAppDispatch();
  const { currentServerId } = useAppSelector((state) => state.testServerStore);
  const [loading, setLoading] = useState(false);

  const handleDeleteServer = async () => {
    close();
    setLoading(true);

    const result = await dispatch(
      deleteServer({
        serverId: currentServerId!,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Сервер удален');
    }

    setLoading(false);
  };

  return (
    <>
      <Stack gap="md">
        <Text size="lg" w={500}>
          Удаление сервера
        </Text>
        <Button
          color="red"
          leftSection={<Trash size={16} />}
          radius="md"
          onClick={open}
          disabled={loading}
        >
          Удалить
        </Button>
      </Stack>
      <Modal centered opened={opened} onClose={close} withCloseButton={false}>
        <Stack>
          <Text>Вы уверены, что хотите удалить сервер?</Text>
          <Group justify="flex-end">
            <Button radius="md" variant="outline" onClick={close}>
              Нет
            </Button>
            <Button color="red" radius="md" onClick={handleDeleteServer}>
              Да
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
