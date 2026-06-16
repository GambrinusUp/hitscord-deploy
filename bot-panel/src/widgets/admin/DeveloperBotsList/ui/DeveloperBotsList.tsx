import type { DeveloperBot } from '~/entities/admin';

import {
  Accordion,
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';

import { RevokeDeveloperBotTokensButton } from '~/features/admin';
import { BotLogsCard } from '~/widgets/bots/BotLogsCard/BotLogsCard';

interface DeveloperBotsListProps {
  developerId: string;
  bots: DeveloperBot[];
}

export const DeveloperBotsList = ({
  developerId,
  bots,
}: DeveloperBotsListProps) => {
  if (bots.length === 0) {
    return <Text c="dimmed">У разработчика пока нет ботов</Text>;
  }

  return (
    <Stack gap="md">
      {bots.map((bot) => (
        <Card key={bot.id} withBorder radius="md" p="lg">
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <Stack gap={0}>
                <Title order={4}>{bot.name}</Title>
                <Text c="dimmed" size="sm">
                  {bot.accountTag}
                </Text>
              </Stack>
              <Badge variant="light" color={bot.verified ? 'green' : 'gray'}>
                {bot.verified ? 'Верифицирован' : 'Не верифицирован'}
              </Badge>
            </Group>

            <Text>{bot.description || 'Без описания'}</Text>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
              <Card withBorder p="sm" radius="md">
                <Text size="sm" c="dimmed">
                  Всего токенов
                </Text>
                <Text fw={700}>{bot.tokenStats.total}</Text>
              </Card>
              <Card withBorder p="sm" radius="md">
                <Text size="sm" c="dimmed">
                  Активные токены
                </Text>
                <Text fw={700}>{bot.tokenStats.active}</Text>
              </Card>
              <Card withBorder p="sm" radius="md">
                <Text size="sm" c="dimmed">
                  Отозванные токены
                </Text>
                <Text fw={700}>{bot.tokenStats.revoked}</Text>
              </Card>
            </SimpleGrid>

            <Group gap="xs">
              {bot.permissions.map((permission) => (
                <Badge key={permission} variant="dot" radius="md">
                  {permission}
                </Badge>
              ))}
            </Group>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Создан: {new Date(bot.createdAt).toLocaleDateString()}
              </Text>
              <RevokeDeveloperBotTokensButton
                botId={bot.id}
                developerId={developerId}
              />
            </Group>

            <Accordion variant="separated">
              <Accordion.Item value="installs">
                <Accordion.Control>
                  Установки ({bot.installs.length})
                </Accordion.Control>
                <Accordion.Panel>
                  <Table striped withTableBorder>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Server ID</Table.Th>
                        <Table.Th>Дата установки</Table.Th>
                        <Table.Th>Состояние</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {bot.installs.map((install) => (
                        <Table.Tr key={install.id}>
                          <Table.Td>
                            <Text size="sm">{install.serverId}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">
                              {new Date(install.installedAt).toLocaleString()}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              color={install.enabled ? 'green' : 'red'}
                              size="sm"
                            >
                              {install.enabled ? 'Активен' : 'Отключен'}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="logs">
                <Accordion.Control>Логи команд</Accordion.Control>
                <Accordion.Panel>
                  <BotLogsCard bot={bot as any} />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};
