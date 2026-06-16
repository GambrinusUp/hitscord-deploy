import type { Developer } from '~/entities/admin';

import { Button, Group, Table, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

interface DevelopersTableProps {
  developers: Developer[];
}

export const DevelopersTable = ({ developers }: DevelopersTableProps) => {
  if (developers.length === 0) {
    return <Text c="dimmed">Разработчики не найдены</Text>;
  }

  return (
    <Table.ScrollContainer minWidth={980}>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Имя</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Ботов</Table.Th>
            <Table.Th>Установок</Table.Th>
            <Table.Th>Активных токенов</Table.Th>
            <Table.Th>Отозванных токенов</Table.Th>
            <Table.Th>Действие</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {developers.map((developer) => (
            <Table.Tr key={developer.id}>
              <Table.Td>
                <Group gap="xs">
                  <Text fw={600}>{developer.name}</Text>
                </Group>
              </Table.Td>
              <Table.Td>{developer.email}</Table.Td>
              <Table.Td>{developer.stats.botsCount}</Table.Td>
              <Table.Td>{developer.stats.installsCount}</Table.Td>
              <Table.Td>{developer.stats.activeTokensCount}</Table.Td>
              <Table.Td>{developer.stats.revokedTokensCount}</Table.Td>
              <Table.Td>
                <Link to={`/admin/developers/${developer.id}`}>
                  <Button size="xs" radius="md" variant="light">
                    Открыть
                  </Button>
                </Link>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
