import type { BotWithApiKey } from '~/entities/bots';

import {
  Button,
  Group,
  Stack,
  Text,
  Paper,
  CopyButton,
  Tooltip,
  Badge,
  Loader,
  Alert,
} from '@mantine/core';
import { Copy, Check, AlertCircle } from 'lucide-react';

interface BotConfirmationFormProps {
  bot: BotWithApiKey | null;
  isLoading: boolean;
  error: Error | null;
  onBack: () => void;
  onFinish: () => void;
}

const PERMISSIONS_LABELS: Record<string, string> = {
  MANAGE_ROLES: 'Управление ролями',
  MANAGE_CHANNELS: 'Управление каналами',
  SEND_MESSAGES: 'Отправка сообщений',
  READ_MESSAGES: 'Чтение сообщений',
  ATTACH_FILES: 'Прикрепление файлов',
  JOIN_VOICE: 'Присоединение к голосовым каналам',
  RECORD_AUDIO: 'Запись аудио',
  STREAM_SCREEN: 'Трансляция экрана',
  MUTE_MEMBERS: 'Отключение микрофона участникам',
  KICK_MEMBERS: 'Удаление участников',
  CREATE_LESSON: 'Создание заданий',
  CHECK_ATTENDANCE: 'Проверка посещаемости',
  NOTIFY_CHANNEL: 'Уведомление канала',
};

export const BotConfirmationForm = ({
  bot,
  isLoading,
  error,
  onBack,
  onFinish,
}: BotConfirmationFormProps) => {
  if (isLoading) {
    return (
      <Stack gap="lg" w="100%" maw={600} align="center">
        <Loader />
        <Text>Создание бота...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack gap="lg" w="100%" maw={600}>
        <Alert icon={<AlertCircle size={16} />} color="red" title="Ошибка">
          {error.message || 'Произошла ошибка при создании бота'}
        </Alert>
        <Group justify="center">
          <Button variant="default" onClick={onBack}>
            Назад
          </Button>
        </Group>
      </Stack>
    );
  }

  if (!bot) {
    return null;
  }

  return (
    <Stack gap="lg" w="100%" maw={600}>
      <Alert icon={<AlertCircle size={16} />} color="yellow" title="⚠️ Важно">
        <Text size="sm">
          Это единственный раз, когда вы сможете просмотреть API ключ бота.
          Скопируйте и сохраните его в безопасном месте. После закрытия этого
          окна ключ больше не будет доступен.
        </Text>
      </Alert>

      <Paper p="lg" radius="md" withBorder>
        <Stack gap="md">
          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Имя бота
            </Text>
            <Text fw={600}>{bot.name}</Text>
          </div>

          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Описание
            </Text>
            <Text>{bot.description}</Text>
          </div>

          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Тег аккаунта
            </Text>
            <Text fw={600} ff="monospace">
              {bot.accountTag}
            </Text>
          </div>

          <div>
            <Text size="sm" c="dimmed" fw={500} mb="md">
              Разрешения
            </Text>
            <Group gap="xs" wrap="wrap">
              {bot.permissions.map((permission) => (
                <Badge key={permission} variant="light">
                  {PERMISSIONS_LABELS[permission] || permission}
                </Badge>
              ))}
            </Group>
          </div>

          <div>
            <Text size="sm" c="dimmed" fw={500} mb="xs">
              API ключ
            </Text>
            <Group gap="xs" wrap="nowrap">
              <Text
                fw={600}
                ff="monospace"
                size="sm"
                style={{ wordBreak: 'break-all' }}
              >
                {bot.botApiKey}
              </Text>
              <CopyButton value={bot.botApiKey} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={copied ? 'Скопировано!' : 'Скопировать'}
                    withArrow
                    position="right"
                  >
                    <Button
                      color={copied ? 'teal' : 'gray'}
                      variant="subtle"
                      size="xs"
                      onClick={copy}
                      px={8}
                    >
                      {copied ? (
                        <Check style={{ width: 16 }} />
                      ) : (
                        <Copy style={{ width: 16 }} />
                      )}
                    </Button>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          </div>

          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Дата создания
            </Text>
            <Text>{new Date(bot.createdAt).toLocaleString('ru-RU')}</Text>
          </div>
        </Stack>
      </Paper>

      <Group justify="center" mt="lg">
        <Button variant="default" onClick={onBack}>
          Назад
        </Button>
        <Button onClick={onFinish} variant="filled">
          Завершить
        </Button>
      </Group>
    </Stack>
  );
};
