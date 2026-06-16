import type { Bot } from '~/entities/bots';

import {
  ActionIcon,
  Badge,
  Card,
  Group,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import { RefreshCcw, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';



import { useBotLogs, useClearBotLogs } from '~/entities/bots/api';

interface BotLogsCardProps {
  bot: Bot;
}

export const BotLogsCard = ({ bot }: BotLogsCardProps) => {
  const [selectedServerId, setSelectedServerId] = useState<string | null>(
    bot.installs?.[0]?.serverId || null,
  );

  const {
    data: logs,
    isLoading,
    refetch,
    isFetching,
  } = useBotLogs(bot.id, selectedServerId || '', {
    enabled: !!selectedServerId,
  });

  const { mutate: clearLogs, isPending: isClearing } = useClearBotLogs();

  const handleClearLogs = () => {
    if (
      selectedServerId &&
      confirm('Вы уверены, что хотите очистить логи для этого сервера?')
    ) {
      clearLogs({ id: bot.id, serverId: selectedServerId });
    }
  };

  const serverOptions = useMemo(
    () =>
      (bot.installs || []).map((install) => ({
        value: install.serverId,
        label: `Server ${install.serverId.slice(0, 8)}... (${
          install.enabled ? 'Активен' : 'Отключен'
        })`,
      })),
    [bot.installs],
  );

  return (
    <Card p="md" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Text fw={700} size="xl">
            Логи команд
          </Text>
          <Group>
            <Select
              placeholder="Выберите сервер"
              data={serverOptions}
              value={selectedServerId}
              onChange={setSelectedServerId}
              style={{ width: 250 }}
              disabled={!bot.installs || bot.installs.length === 0}
            />
            <Tooltip label="Обновить">
              <ActionIcon
                variant="light"
                onClick={() => refetch()}
                loading={isFetching}
                disabled={!selectedServerId}
              >
                <RefreshCcw size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Очистить логи">
              <ActionIcon
                color="red"
                variant="light"
                onClick={handleClearLogs}
                loading={isClearing}
                disabled={!selectedServerId}
              >
                <Trash2 size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        {selectedServerId ? (
          <ScrollArea h={400}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Время</Table.Th>
                  <Table.Th>Событие</Table.Th>
                  <Table.Th>Статус</Table.Th>
                  <Table.Th>Детали</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {isLoading ? (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text ta="center" py="md">Загрузка...</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : !logs || logs.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text ta="center" py="md" c="dimmed">
                        Логов не найдено
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  logs.map((log) => (
                    <Table.Tr key={log.id}>
                      <Table.Td>
                        <Text size="xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="outline" size="sm">
                          {log.event}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={log.success ? 'green' : 'red'} size="sm">
                          {log.success ? 'Успех' : 'Ошибка'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Tooltip label={log.details} multiline w={300}>
                          <Text size="xs" truncate maw={250}>
                            {log.errorReason || log.details}
                          </Text>
                        </Tooltip>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        ) : (
          <Text c="dimmed" ta="center" py="xl">
            {!bot.installs || bot.installs.length === 0
              ? 'Бот еще не установлен ни на один сервер'
              : 'Выберите сервер для просмотра логов'}
          </Text>
        )}
      </Stack>
    </Card>
  );
};
