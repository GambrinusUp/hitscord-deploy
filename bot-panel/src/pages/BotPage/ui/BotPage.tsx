import {
  AppShell,
  Box,
  Button,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ArrowLeft, Bot } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { useBot } from '~/entities/bots';
import { DeleteBotButton } from '~/features/bots/DeleteBot/DeleteBotButton';
import {
  AppHeader,
  BotDetailsCard,
  BotLogsCard,
  BotPermissionsCard,
} from '~/widgets';

export const BotPage = () => {
  const [opened, { toggle }] = useDisclosure();
  const { id } = useParams<{ id: string }>();

  const { data: botData, isLoading, error } = useBot(id || '');

  if (isLoading) {
    return (
      <AppShell header={{ height: 60 }} padding="md">
        <AppHeader opened={opened} toggle={toggle} />
        <AppShell.Main>
          <Stack align="center" justify="center" h="80vh">
            <Loader size="xl" />
            <Text>Загрузка данных бота...</Text>
          </Stack>
        </AppShell.Main>
      </AppShell>
    );
  }

  if (error || !botData) {
    return (
      <AppShell header={{ height: 60 }} padding="md">
        <AppHeader opened={opened} toggle={toggle} />
        <AppShell.Main>
          <Stack align="center" justify="center" h="80vh">
            <Text c="red" size="xl" fw={700}>
              Ошибка при загрузке бота
            </Text>
            <Link to="/dashboard">
              <Button variant="outline">Вернуться на главную</Button>
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
        <Stack px="xl" gap="md">
          <Group justify="space-between">
            <Link to="/dashboard">
              <Button leftSection={<ArrowLeft />} radius="md" variant="subtle">
                Назад
              </Button>
            </Link>
            <DeleteBotButton botId={botData.id} botName={botData.name} />
          </Group>

          <Group>
            <Box
              bg="blue"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 6,
                borderRadius: 8,
              }}
            >
              <Bot size={40} color="white" />
            </Box>
            <Stack gap={0}>
              <Title order={1}>{botData.name}</Title>
              <Text c="dimmed">{botData.accountTag}</Text>
            </Stack>
          </Group>

          <BotDetailsCard bot={botData} />
          <BotPermissionsCard permissions={botData.permissions} />
          <BotLogsCard bot={botData} />
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
};
