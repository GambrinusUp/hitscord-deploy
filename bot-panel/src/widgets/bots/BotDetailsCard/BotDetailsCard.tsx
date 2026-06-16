import type { Bot } from '~/entities/bots';

import {
  Badge,
  Card,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from '@mantine/core';

import { RegenerateTokenButton, RevokeTokensButton } from '~/features/bots/ManageTokens';

interface BotDetailsCardProps {
  bot: Bot;
}

export const BotDetailsCard = ({ bot }: BotDetailsCardProps) => {
  return (
    <Card p="md" radius="md" withBorder>
      <Text fw={700} size="xl" mb="md">
        Информация о боте
      </Text>
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        <Stack gap={0}>
          <Text c="dimmed" size="sm">
            ID бота
          </Text>
          <Text>{bot.id}</Text>
        </Stack>
        <Stack gap={0}>
          <Text c="dimmed" size="sm">
            Владелец (ID)
          </Text>
          <Text>{bot.ownerId}</Text>
        </Stack>
        <Stack gap={0}>
          <Text c="dimmed" size="sm">
            Дата создания
          </Text>
          <Text>{new Date(bot.createdAt).toLocaleDateString()}</Text>
        </Stack>
        <Stack gap={0}>
          <Text c="dimmed" size="sm">
            Статус
          </Text>
          <Badge
            variant="light"
            color={bot.verified ? 'green' : 'gray'}
            radius="md"
          >
            {bot.verified ? 'Верифицирован' : 'Не верифицирован'}
          </Badge>
        </Stack>
        <Stack gap={0}>
          <Text c="dimmed" size="sm">
            Описание
          </Text>
          <Text>{bot.description || 'Нет описания'}</Text>
        </Stack>
        <Stack gap={0}>
          <Text c="dimmed" size="sm">
            Установок
          </Text>
          <Text>{bot.installs?.length || 0}</Text>
        </Stack>
      </SimpleGrid>

      {bot.installs?.length > 0 && (
        <>
          <Divider my="lg" label="Установки на сервера" labelPosition="center" />
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
                <Table.Tr key={install.serverId}>
                  <Table.Td>
                    <Text size="sm">{install.serverId}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(install.installedAt).toLocaleString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={install.enabled ? 'green' : 'red'} size="sm">
                      {install.enabled ? 'Активен' : 'Отключен'}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </>
      )}

      <Divider my="lg" label="Управление токенами" labelPosition="center" />

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <Stack gap="xs">
          <Text fw={500} size="sm">
            Активные токены: {bot.activeTokensCount}
          </Text>
          <Text fw={500} size="sm">
            Отозванные токены: {bot.revokedTokensCount}
          </Text>
          {bot.tokenRevoked && (
            <Badge color="red" variant="light">
              Токен отозван
            </Badge>
          )}
        </Stack>

        <Group justify="flex-end" align="flex-end">
          <RegenerateTokenButton botId={bot.id} />
          <RevokeTokensButton botId={bot.id} />
        </Group>
      </SimpleGrid>
    </Card>
  );
};

