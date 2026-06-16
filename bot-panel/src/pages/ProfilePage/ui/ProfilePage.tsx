import {
  AppShell,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Copy } from 'lucide-react';

import { UserRole, useProfile } from '~/entities/auth';
import { LogoutButton } from '~/features/auth';
import { AppHeader } from '~/widgets';

const ROLE_LABELS = {
  [UserRole.ADMIN]: 'Администратор',
  [UserRole.DEVELOPER]: 'Разработчик',
};

export const ProfilePage = () => {
  const [opened, { toggle }] = useDisclosure();
  const { data: profile, isPending, isError } = useProfile();

  if (isPending) {
    return (
      <AppShell header={{ height: 60 }} padding="md">
        <AppHeader opened={opened} toggle={toggle} />
        <AppShell.Main>
          <Stack align="center" justify="center" h="100vh">
            <Loader size="lg" />
          </Stack>
        </AppShell.Main>
      </AppShell>
    );
  }

  if (isError || !profile) {
    return (
      <AppShell header={{ height: 60 }} padding="md">
        <AppHeader opened={opened} toggle={toggle} />
        <AppShell.Main>
          <Stack align="center" justify="center" h="100vh">
            <Text c="red">Ошибка загрузки профиля</Text>
          </Stack>
        </AppShell.Main>
      </AppShell>
    );
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.id);
    notifications.show({
      title: 'Скопировано',
      message: 'ID скопирован в буфер обмена',
      autoClose: 3000,
    });
  };

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppHeader opened={opened} toggle={toggle} />
      <AppShell.Main>
        <Stack p="md" gap="lg" align="center">
          <Title order={1}>Профиль</Title>

          <Card shadow="sm" padding="lg" radius="md" w={{ base: '100%', sm: 500 }}>
            <Stack gap="md">
              <div>
                <Text size="sm" c="dimmed" fw={500}>
                  Имя
                </Text>
                <Text fw={500}>{profile.name}</Text>
              </div>

              <div>
                <Text size="sm" c="dimmed" fw={500}>
                  Email
                </Text>
                <Text fw={500}>{profile.email}</Text>
              </div>

              <div>
                <Text size="sm" c="dimmed" fw={500}>
                  Роль
                </Text>
                <Text fw={500}>{ROLE_LABELS[profile.role]}</Text>
              </div>

              <div>
                <Text size="sm" c="dimmed" fw={500}>
                  ID пользователя
                </Text>
                <Group gap="xs">
                  <Text fw={500} style={{ wordBreak: 'break-all' }}>
                    {profile.id}
                  </Text>
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={handleCopyId}
                    leftSection={<Copy size={16} />}
                  >
                    Копировать
                  </Button>
                </Group>
              </div>

              <Group justify="center" mt="md">
                <LogoutButton />
              </Group>
            </Stack>
          </Card>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
};
