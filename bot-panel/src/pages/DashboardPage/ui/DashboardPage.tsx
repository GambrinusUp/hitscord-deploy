import {
  AppShell,
  Button,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useBots } from '~/entities/bots';
import { AppHeader, BotCard } from '~/widgets';

export const DashboardPage = () => {
  const [opened, { toggle }] = useDisclosure();
  const {
    data: bots = [],
    isPending,
    isError,
  } = useBots({
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  if (isPending) {
    return (
      <AppShell header={{ height: 60 }} padding="md">
        <AppHeader opened={opened} toggle={toggle} />
        <AppShell.Main>
          <Stack align="center" justify="center">
            <Loader size="lg" />
          </Stack>
        </AppShell.Main>
      </AppShell>
    );
  }

  if (isError) {
    return (
      <AppShell header={{ height: 60 }} padding="md">
        <AppHeader opened={opened} toggle={toggle} />
        <AppShell.Main>
          <Stack align="center" justify="center" h="100vh">
            <Text c="red">Ошибка загрузки списка ботов</Text>
          </Stack>
        </AppShell.Main>
      </AppShell>
    );
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppHeader opened={opened} toggle={toggle} />
      <AppShell.Main>
        <Stack p="md">
          <Group justify="space-between" align="center" w="100%">
            <Stack gap="xs">
              <Title order={1}>Мои боты</Title>
              <Text c="dimmed" size="md" fw={500}>
                Управляйте своими ботами и создавайте новые
              </Text>
            </Stack>
            <Link to="/create-bot">
              <Button radius="md" leftSection={<Plus />}>
                Создать бота
              </Button>
            </Link>
          </Group>
          {bots.length === 0 ? (
            <Stack align="center" justify="center" p="xl">
              <Text c="dimmed">У вас нет ботов</Text>
              <Link to="/create-bot">
                <Button radius="md">Создать первого бота</Button>
              </Link>
            </Stack>
          ) : (
            <SimpleGrid
              cols={{ base: 1, sm: 2, lg: 4 }}
              spacing={{ base: 10, sm: 'xl' }}
              verticalSpacing={{ base: 'md', sm: 'xl' }}
            >
              {bots.map((bot) => (
                <BotCard
                  key={bot.id}
                  id={bot.id}
                  name={bot.name}
                  createdAt={bot.createdAt}
                  permissions={bot.permissions}
                  verified={bot.verified}
                />
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
};
