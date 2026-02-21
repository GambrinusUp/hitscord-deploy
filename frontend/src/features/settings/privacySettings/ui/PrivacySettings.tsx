import type { SettingsForm } from '~/entities/user';

import { Divider, Group, Stack, Switch, Text, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

interface PrivacySettingsProps {
  isEdit: boolean;
  form: UseFormReturnType<SettingsForm>;
}

export const PrivacySettings = ({ isEdit, form }: PrivacySettingsProps) => {
  return (
    <>
      <Title order={2} c="var(--color-white)">
        Настройки приватности
      </Title>
      <Text c="dimmed">
        Управляйте тем, как другие пользователи могут взаимодействовать с вами
      </Text>
      <Group justify="space-between" mt="lg">
        <Stack gap={0}>
          <Text c="var(--color-white)">Уведомления</Text>
          <Text c="dimmed">Получать уведомления о новых сообщениях</Text>
        </Stack>
        <Switch
          disabled={!isEdit}
          defaultChecked
          size="lg"
          key={form.key('notifiable')}
          {...form.getInputProps('notifiable', { type: 'checkbox' })}
        />
      </Group>
      <Divider mt="lg" />
      <Group justify="space-between" mt="lg">
        <Stack gap={0}>
          <Text c="var(--color-white)">Заявки в друзья</Text>
          <Text c="dimmed">
            Разрешить другим пользователям отправлять заявки в друзья
          </Text>
        </Stack>
        <Switch
          disabled={!isEdit}
          defaultChecked
          size="lg"
          key={form.key('friendshipApplication')}
          {...form.getInputProps('friendshipApplication', {
            type: 'checkbox',
          })}
        />
      </Group>
      <Divider mt="lg" />
      <Group justify="space-between" mt="lg">
        <Stack gap={0}>
          <Text c="var(--color-white)">Сообщения от незнакомцев</Text>
          <Text c="dimmed">
            Разрешить получать сообщения от пользователей, которые не в списке
            друзей
          </Text>
        </Stack>
        <Switch
          disabled={!isEdit}
          defaultChecked
          size="lg"
          key={form.key('nonFriendMessage')}
          {...form.getInputProps('nonFriendMessage', { type: 'checkbox' })}
        />
      </Group>
    </>
  );
};
