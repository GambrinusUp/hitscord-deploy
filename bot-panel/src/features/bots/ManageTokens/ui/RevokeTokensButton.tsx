import { Button, Group, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Trash } from 'lucide-react';

import { useRevokeBotTokens } from '~/entities/bots';
import { useNotification } from '~/shared/hooks/useNotification';

interface RevokeTokensButtonProps {
  botId: string;
}

export const RevokeTokensButton = ({ botId }: RevokeTokensButtonProps) => {
  const { showSuccess, showError } = useNotification();
  const [opened, { open, close }] = useDisclosure(false);

  const { mutate, isPending } = useRevokeBotTokens({
    onSuccess: () => {
      showSuccess('Все токены успешно отозваны');
      close();
    },
    onError: () => {
      showError('Не удалось отозвать токены');
    },
  });

  const handleRevoke = () => {
    mutate(botId);
  };

  return (
    <>
      <Button
        variant="light"
        color="red"
        leftSection={<Trash size={16} />}
        onClick={open}
        loading={isPending}
      >
        Отозвать всё
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Отзыв всех токенов"
        centered
      >
        <Text size="sm" mb="lg">
          Вы уверены, что хотите отозвать все активные токены для этого бота? Бот
          прекратит работу до тех пор, пока вы не сгенерируете новый ключ.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={close}>
            Отмена
          </Button>
          <Button color="red" onClick={handleRevoke} loading={isPending}>
            Отозвать
          </Button>
        </Group>
      </Modal>
    </>
  );
};
