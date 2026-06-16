import {
  Alert,
  Badge,
  Button,
  Group,
  Loader,
  Modal,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';

import { BotAPI, type CreatorServer } from '~/entities/bot';

interface AddBotToServerModalProps {
  opened: boolean;
  botId: string;
  botName: string;
  onClose: () => void;
  onSuccess: (serverId: string) => void;
}

export const AddBotToServerModal = ({
  opened,
  botId,
  botName,
  onClose,
  onSuccess,
}: AddBotToServerModalProps) => {
  const [servers, setServers] = useState<CreatorServer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!opened) {
      return;
    }

    const loadServers = async () => {
      try {
        setError('');
        setIsLoading(true);
        const data = await BotAPI.getCreatorServers();

        setServers(data);
      } catch {
        setError('Не удалось загрузить список ваших серверов');
      } finally {
        setIsLoading(false);
      }
    };

    loadServers();
  }, [opened]);

  const handleAdd = async (serverId: string, serverName: string) => {
    try {
      setIsSubmitting(true);
      await BotAPI.setBotToServer({ botId, serverId });

      notifications.show({
        title: 'Готово',
        message: `Бот \"${botName}\" добавлен на сервер \"${serverName}\"`,
        color: 'green',
      });

      onSuccess(serverId);
      onClose();
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось добавить бота на сервер',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      radius="lg"
      title={`Добавить ${botName} на сервер`}
    >
      <Stack gap="sm">
        {isLoading && (
          <Group justify="center" py="md">
            <Loader size="sm" />
          </Group>
        )}

        {error && <Alert color="red">{error}</Alert>}

        {!isLoading && !error && servers.length === 0 && (
          <Alert color="blue">У вас пока нет серверов, где вы владелец</Alert>
        )}

        {!isLoading &&
          !error &&
          servers.map((server) => (
            <Paper key={server.serverId} withBorder p="sm" radius="md">
              <Group justify="space-between" align="center">
                <div>
                  <Text fw={600}>{server.serverName}</Text>
                  <Text size="xs" c="dimmed">
                    ID: {server.serverId}
                  </Text>
                </div>
                <Group gap="xs">
                  <Badge variant="light" color="gray">
                    Владелец
                  </Badge>
                  <Button
                    size="xs"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    onClick={() =>
                      handleAdd(server.serverId, server.serverName)
                    }
                  >
                    Выбрать
                  </Button>
                </Group>
              </Group>
            </Paper>
          ))}
      </Stack>
    </Modal>
  );
};
