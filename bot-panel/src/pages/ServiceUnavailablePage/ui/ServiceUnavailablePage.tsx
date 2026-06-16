import { AppShell, Badge, Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';

import { AppHeader } from '~/widgets';

export const ServiceUnavailablePage = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppHeader opened={opened} toggle={toggle} />
      <AppShell.Main>
        <Container size="sm" py={{ base: 48, sm: 96 }}>
          <Paper withBorder radius="md" p={{ base: 'lg', sm: 'xl' }}>
            <Stack gap="lg" align="flex-start">
              <Badge variant="light" color="blue">
                Плановые работы
              </Badge>

              <Stack gap="xs">
                <Title order={1}>Сервис временно недоступен</Title>
                <Text c="dimmed" size="lg">
                  Мы переносим BotPanel на новые серверы.
                </Text>
              </Stack>

              <Text>
                Создание ботов, регистрация и вход будут снова доступны после завершения
                миграции.
              </Text>

              <Group>
                <Button component={Link} to="/" radius="md">
                  На главную
                </Button>
                <Button component={Link} to="/docs" radius="md" variant="outline">
                  Открыть документацию
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
