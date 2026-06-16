import {
  Alert,
  Box,
  Button,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconArrowLeft, IconSearch } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { socket } from '~/api';
import { BotAPI, BotCard, type Bot } from '~/entities/bot';
import { AddBotToServerModal } from '~/features/bot/addToServer';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setOpenHome, setUserStreamView } from '~/store/AppStore';
import { setCurrentServerId } from '~/store/ServerStore';

export const BotsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userStore);
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);

  useEffect(() => {
    const loadBots = async () => {
      try {
        setIsLoading(true);
        const data = await BotAPI.getAvailableBots();

        setBots(data);
      } catch {
        setError('Не удалось загрузить список ботов');
      } finally {
        setIsLoading(false);
      }
    };

    loadBots();
  }, []);

  const filteredBots = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return bots;
    }

    return bots.filter((bot) => {
      return (
        bot.name.toLowerCase().includes(normalizedQuery) ||
        bot.description.toLowerCase().includes(normalizedQuery) ||
        bot.accountTag.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [bots, query]);

  const handleAddSuccess = (serverId: string) => {
    dispatch(setCurrentServerId(serverId));
    dispatch(setUserStreamView(false));
    dispatch(setOpenHome(false));
    socket.emit('setServer', {
      serverId,
      userName: user.name,
      userId: user.id,
    });
    navigate('/main');
  };

  return (
    <Box
      mih="100vh"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(17, 139, 163, 0.25), transparent 35%), linear-gradient(120deg, #0d1117 0%, #12141c 100%)',
      }}
      py="xl"
    >
      <Container size="lg">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Group>
              <Button
                variant="subtle"
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => navigate(-1)}
              >
                Назад
              </Button>
              <Title order={2}>Выбор ботов</Title>
            </Group>
            <Text c="dimmed">Всего: {filteredBots.length}</Text>
          </Group>

          <TextInput
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Поиск по названию, описанию или тегу"
            leftSection={<IconSearch size={16} />}
            radius="md"
            size="md"
          />

          {isLoading && (
            <Group justify="center" py="xl">
              <Loader />
            </Group>
          )}

          {error && <Alert color="red">{error}</Alert>}

          {!isLoading && !error && filteredBots.length === 0 && (
            <Alert color="blue">По вашему запросу ничего не найдено</Alert>
          )}

          {!isLoading && !error && filteredBots.length > 0 && (
            <SimpleGrid
              cols={{ base: 1, sm: 2 }}
              spacing="md"
              verticalSpacing="md"
            >
              {filteredBots.map((bot) => (
                <BotCard
                  key={bot.id}
                  bot={bot}
                  onAddToServer={(selected) => setSelectedBot(selected)}
                />
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Container>

      <AddBotToServerModal
        opened={Boolean(selectedBot)}
        botId={selectedBot?.id ?? ''}
        botName={selectedBot?.name ?? ''}
        onClose={() => setSelectedBot(null)}
        onSuccess={handleAddSuccess}
      />
    </Box>
  );
};
