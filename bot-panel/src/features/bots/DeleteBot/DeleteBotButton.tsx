import { Button, Modal, Stack, Text, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useDeleteBot } from '~/entities/bots';
import { useNotification } from '~/shared/hooks/useNotification';

interface DeleteBotButtonProps {
  botId: string;
  botName: string;
}

export const DeleteBotButton = ({ botId, botName }: DeleteBotButtonProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const { mutate: deleteBot, isPending } = useDeleteBot({
    onSuccess: () => {
      showSuccess('Бот успешно удален');
      close();
      navigate('/dashboard');
    },
    onError: () => {
      showError('Не удалось удалить бота');
    },
  });

  const handleDelete = () => {
    deleteBot(botId);
  };

  return (
    <>
      <Button
        variant="light"
        color="red"
        leftSection={<Trash size={16} />}
        onClick={open}
      >
        Удалить бота
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Подтверждение удаления"
        centered
      >
        <Stack>
          <Text>
            Вы уверены, что хотите удалить бота <b>{botName}</b>? Это действие
            нельзя будет отменить.
          </Text>
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>
              Отмена
            </Button>
            <Button color="red" onClick={handleDelete} loading={isPending}>
              Удалить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
