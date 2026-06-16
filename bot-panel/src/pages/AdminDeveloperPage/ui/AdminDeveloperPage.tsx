import {
  AppShell,
  Button,
  Card,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { useAdminDeveloper } from '~/entities/admin';
import { AppHeader } from '~/widgets';
import { DeveloperBotsList } from '~/widgets/admin/DeveloperBotsList';

export const AdminDeveloperPage = () => {
  const [opened, { toggle }] = useDisclosure();
  const { id } = useParams<{ id: string }>();

  const { data: developer, isLoading, isError } = useAdminDeveloper(id || '');

  if (isLoading) {
    return (
      <AppShell header={{ height: 60 }} padding="md">
        <AppHeader opened={opened} toggle={toggle} />
        <AppShell.Main>
          <Stack align="center" justify="center" h="80vh">
            <Loader size="xl" />
          </Stack>
        </AppShell.Main>
      </AppShell>
    );
  }

  if (isError || !developer) {
    return (
      <AppShell header={{ height: 60 }} padding="md">
        <AppHeader opened={opened} toggle={toggle} />
        <AppShell.Main>
          <Stack align="center" justify="center" h="80vh">
            <Text c="red">Не удалось загрузить данные разработчика</Text>
            <Link to="/admin/developers">
              <Button variant="outline">Вернуться к списку</Button>
            </Link>
          </Stack>
        </AppShell.Main>
      </AppShell>
    );
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppHeader opened={opened} toggle={toggle} />
      <AppShell.Main>
        <Stack p="md" gap="lg">
          <Group justify="space-between">
            <Link to="/admin/developers">
              <Button leftSection={<ArrowLeft size={16} />} variant="subtle">
                К разработчикам
              </Button>
            </Link>
          </Group>

          <Card withBorder radius="md" p="lg">
            <Stack gap="sm">
              <Title order={2}>{developer.name}</Title>
              <Text c="dimmed">{developer.email}</Text>
              <Text size="sm" c="dimmed" style={{ wordBreak: 'break-all' }}>
                ID: {developer.id}
              </Text>

              <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm" mt="sm">
                <Card withBorder p="sm" radius="md">
                  <Text size="sm" c="dimmed">
                    Ботов
                  </Text>
                  <Text fw={700}>{developer.stats.botsCount}</Text>
                </Card>
                <Card withBorder p="sm" radius="md">
                  <Text size="sm" c="dimmed">
                    Установок
                  </Text>
                  <Text fw={700}>{developer.stats.installsCount}</Text>
                </Card>
                <Card withBorder p="sm" radius="md">
                  <Text size="sm" c="dimmed">
                    Активные токены
                  </Text>
                  <Text fw={700}>{developer.stats.activeTokensCount}</Text>
                </Card>
                <Card withBorder p="sm" radius="md">
                  <Text size="sm" c="dimmed">
                    Отозванные токены
                  </Text>
                  <Text fw={700}>{developer.stats.revokedTokensCount}</Text>
                </Card>
              </SimpleGrid>
            </Stack>
          </Card>

          <Stack gap="xs">
            <Title order={3}>Боты разработчика</Title>
            <DeveloperBotsList developerId={developer.id} bots={developer.bots} />
          </Stack>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
};
