import { AppShell, Button, Group, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';

import { UserRole, useProfile } from '~/entities/auth';
import { useAppSelector } from '~/shared';
import { AppHeader } from '~/widgets';

export const MainPage = () => {
  const [opened, { toggle }] = useDisclosure();
  const { isLoggedIn } = useAppSelector((state) => state.authStore);
  const { data: profile } = useProfile({ enabled: isLoggedIn });

  const primaryPath =
    profile?.role === UserRole.ADMIN ? '/admin/developers' : '/dashboard';
  const primaryLabel =
    profile?.role === UserRole.ADMIN ? 'К разработчикам' : 'Создать бота';

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppHeader opened={opened} toggle={toggle} />
      <AppShell.Main>
        <Stack gap="xl" align="center" p="md">
          <Title order={1}>Платформа для создания и управления ботами</Title>
          <Text c="dimmed" fw={500}>
            Создавайте, настраивайте и управляйте своими ботами с помощью мощной
            платформы управления и простого SDK
          </Text>
            <Group>
            <Link to={primaryPath}>
              <Button radius="md">{primaryLabel}</Button>
            </Link>
            <Link to="/docs">
              <Button radius="md" variant="outline">
                Открыть документацию
              </Button>
            </Link>
          </Group>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
};

