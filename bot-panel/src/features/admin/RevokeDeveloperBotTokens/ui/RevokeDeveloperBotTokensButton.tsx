import { Button, Group, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Trash } from 'lucide-react';

import { useRevokeAdminBotTokens } from '~/entities/admin';
import { useNotification } from '~/shared';

interface RevokeDeveloperBotTokensButtonProps {
  botId: string;
  developerId: string;
}

export const RevokeDeveloperBotTokensButton = ({
  botId,
  developerId,
}: RevokeDeveloperBotTokensButtonProps) => {
  const { showSuccess, showError } = useNotification();
  const [opened, { open, close }] = useDisclosure(false);

  const { mutate, isPending } = useRevokeAdminBotTokens({
    onSuccess: () => {
      showSuccess('Токены бота успешно отозваны');
      close();
    },
    onError: () => {
      showError('Не удалось отозвать токены бота');
    },
  });

  const handleRevoke = () => {
    mutate({ botId, developerId });
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
        Отозвать токены
      </Button>

      <Modal opened={opened} onClose={close} title="Отзыв токенов" centered>
        <Text size="sm" mb="lg">
          Вы уверены, что хотите отозвать все активные токены этого бота?
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
