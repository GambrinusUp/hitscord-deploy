import type { SettingsForm, UserSystemRole } from '~/entities/user';

import {
  Avatar,
  Badge,
  Divider,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Calendar, Mail, Tag, User } from 'lucide-react';

import { SystemRoleTypeEnum } from '~/entities/presets';
import { formatDateWithDots } from '~/helpers';
import { useAppSelector } from '~/hooks';
import { useIcon } from '~/shared/lib/hooks';

interface ProfileSettingsProps {
  isEdit: boolean;
  form: UseFormReturnType<SettingsForm>;
  updateAction: React.ReactNode;
  systemRoles: UserSystemRole[];
}

export const ProfileSettings = ({
  isEdit,
  form,
  systemRoles,
  updateAction,
}: ProfileSettingsProps) => {
  const { user } = useAppSelector((state) => state.userStore);
  const { iconBase64 } = useIcon(user.icon?.fileId);

  const getRoleName = (type: SystemRoleTypeEnum) => {
    switch (type) {
      case SystemRoleTypeEnum.Student:
        return 'Студент';
      case SystemRoleTypeEnum.Teacher:
        return 'Преподаватель';
      default:
        return '';
    }
  };

  return (
    <>
      <Title order={2}>Информация о профиле</Title>
      <Text c="dimmed">Основная информация о вашем аккаунте</Text>
      <Group mt="md">
        <Avatar src={iconBase64} alt="User profile icon" size="xl" />
        <Stack>
          <Group>
            <Title order={4}>{user.name}</Title>
            <Badge variant="default">{user.tag}</Badge>
          </Group>
          <Group>
            {systemRoles.map((role) => (
              <Badge variant="light" key={role.name}>
                {`${role.name} (${getRoleName(role.type)})`}
              </Badge>
            ))}
          </Group>
          <Group>
            <Calendar />
            <Text c="dimmed">
              Аккаунт создан: {formatDateWithDots(user.accontCreateDate)}
            </Text>
          </Group>
          {updateAction}
        </Stack>
      </Group>
      <Divider mt="md" />
      <Stack mt="md">
        <TextInput
          leftSection={<User />}
          radius="md"
          label="Имя"
          placeholder="Введите имя"
          description="от 5 до 50 символов"
          key={form.key('name')}
          {...form.getInputProps('name')}
          maxLength={50}
          disabled={!isEdit}
        />
        <TextInput
          leftSection={<Mail />}
          radius="md"
          label="Электронная почта"
          placeholder="Введите электронную почту"
          key={form.key('email')}
          {...form.getInputProps('email')}
          maxLength={50}
          disabled={!isEdit}
        />
        <TextInput
          leftSection={<Tag />}
          radius="md"
          label="Тег пользователя"
          placeholder="Введите тег пользователя"
          value={user.tag}
          disabled
        />
        <NumberInput
          label="Длительность уведомления (сек.)"
          placeholder="Число от 2 до 20"
          key={form.key('notificationLifeTime')}
          {...form.getInputProps('notificationLifeTime')}
          min={2}
          max={20}
          disabled={!isEdit}
        />
      </Stack>
    </>
  );
};
