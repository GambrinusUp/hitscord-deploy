import {
  ActionIcon,
  Button,
  CopyButton,
  Group,
  Modal,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { useRegenerateBotToken } from '~/entities/bots';
import { useNotification } from '~/shared/hooks/useNotification';

interface RegenerateTokenButtonProps {
  botId: string;
}

export const RegenerateTokenButton = ({ botId }: RegenerateTokenButtonProps) => {
  const { showSuccess, showError } = useNotification();
  const [opened, { open, close }] = useDisclosure(false);
  const [newToken, setNewToken] = useState<string | null>(null);

  const { mutate, isPending } = useRegenerateBotToken({
    onSuccess: (data: string) => {
      showSuccess('API ключ успешно регенерирован');
      setNewToken(data);
      close();
    },
    onError: () => {
      showError('Не удалось регенерировать API ключ');
    },
  });

  const handleRegenerate = () => {
    mutate(botId);
  };

  return (
    <>
      <Button
        variant="light"
        leftSection={<RefreshCw size={16} />}
        onClick={open}
        loading={isPending}
      >
        Регенерировать
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Регенерация API ключа"
        centered
      >
        <Text size="sm" mb="lg">
          Вы уверены, что хотите регенерировать API ключ? Текущий ключ станет
          недействительным, и вам нужно будет обновить его в настройках вашего
          бота.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={close}>
            Отмена
          </Button>
          <Button color="blue" onClick={handleRegenerate} loading={isPending}>
            Регенерировать
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={!!newToken}
        onClose={() => setNewToken(null)}
        title="Новый API ключ"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            Скопируйте и сохраните этот ключ. Вы больше не сможете его увидеть!
          </Text>
          <Group grow>
            <Text fw={500} style={{ wordBreak: 'break-all' }}>
              {newToken}
            </Text>
            <CopyButton value={newToken || ''}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? 'Скопировано' : 'Копировать'}
                  withArrow
                  position="right"
                >
                  <ActionIcon
                    color={copied ? 'teal' : 'gray'}
                    variant="subtle"
                    onClick={copy}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
          <Button onClick={() => setNewToken(null)}>Понятно</Button>
        </Stack>
      </Modal>
    </>
  );
};
