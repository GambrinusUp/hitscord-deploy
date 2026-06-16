import { Badge, Card, Group, Stack, Text } from '@mantine/core';
import { Shield } from 'lucide-react';

import { BotPermissionType } from '~/entities/bots';

interface BotPermissionsCardProps {
  permissions: string[];
}

const PERMISSIONS_LABELS: Record<string, string> = {
  [BotPermissionType.MANAGE_ROLES]: 'Управление ролями',
  [BotPermissionType.MANAGE_CHANNELS]: 'Управление каналами',
  [BotPermissionType.SEND_MESSAGES]: 'Отправка сообщений',
  [BotPermissionType.READ_MESSAGES]: 'Чтение сообщений',
  [BotPermissionType.ATTACH_FILES]: 'Прикрепление файлов',
  [BotPermissionType.JOIN_VOICE]: 'Присоединение к голосовым каналам',
  [BotPermissionType.RECORD_AUDIO]: 'Запись аудио',
  [BotPermissionType.STREAM_SCREEN]: 'Трансляция экрана',
  [BotPermissionType.MUTE_MEMBERS]: 'Отключение микрофона участникам',
  [BotPermissionType.KICK_MEMBERS]: 'Удаление участников',
  [BotPermissionType.CREATE_LESSON]: 'Создание заданий',
  [BotPermissionType.CHECK_ATTENDANCE]: 'Проверка посещаемости',
  [BotPermissionType.NOTIFY_CHANNEL]: 'Уведомление канала',
};

export const BotPermissionsCard = ({
  permissions,
}: BotPermissionsCardProps) => {
  return (
    <Card p="md" radius="md" withBorder>
      <Stack>
        <Group>
          <Shield />
          <Text fw={700} size="xl">
            Права бота
          </Text>
        </Group>
        <Group gap="xs">
          {permissions.length > 0 ? (
            permissions.map((permission) => (
              <Badge
                key={permission}
                variant="dot"
                radius="md"
                title={permission}
              >
                {PERMISSIONS_LABELS[permission as BotPermissionType] ||
                  permission}
              </Badge>
            ))
          ) : (
            <Text c="dimmed">Нет прав</Text>
          )}
        </Group>
      </Stack>
    </Card>
  );
};
