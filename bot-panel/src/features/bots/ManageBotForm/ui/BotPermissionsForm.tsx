import {
  Button,
  Checkbox,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import React from 'react';

import { BotPermissionType } from '~/entities/bots';

interface BotPermissionsFormProps {
  onNext: (permissions: string[]) => void;
  onBack: () => void;
  initialPermissions?: string[];
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

export const BotPermissionsForm = ({
  onNext,
  onBack,
  initialPermissions = [],
}: BotPermissionsFormProps) => {
  const [permissions, setPermissions] =
    React.useState<string[]>(initialPermissions);

  const handleToggle = (permission: string) => {
    setPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  const handleNext = () => {
    if (permissions.length > 0) {
      onNext(permissions);
    }
  };

  const allPermissions = Object.values(BotPermissionType);

  return (
    <Stack gap="lg" w="100%" maw={700}>
      <div>
        <Text fw={500} mb="md">
          Выберите разрешения для бота (минимум одно):
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {allPermissions.map((permission) => (
            <Checkbox
              key={permission}
              label={PERMISSIONS_LABELS[permission as BotPermissionType]}
              checked={permissions.includes(permission)}
              onChange={() => handleToggle(permission)}
            />
          ))}
        </SimpleGrid>
      </div>

      <Group justify="center" mt="lg">
        <Button variant="default" onClick={onBack}>
          Назад
        </Button>
        <Button onClick={handleNext} disabled={permissions.length === 0}>
          Далее
        </Button>
      </Group>
    </Stack>
  );
};
