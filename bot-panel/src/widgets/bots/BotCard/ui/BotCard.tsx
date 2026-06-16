import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { Bot, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BotCardProps {
  id: string;
  name: string;
  createdAt: string;
  permissions: string[];
  verified: boolean;
}

export const BotCard = ({
  id,
  name,
  createdAt,
  permissions,
  verified,
}: BotCardProps) => {
  return (
    <Card p="md" radius="md" withBorder>
      <Stack>
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
            <Bot />
          </Box>
          <Text fw={700}>{name}</Text>
        </Group>
        <Group>
          <Badge radius="md" variant="light">
            {permissions.length} разрешений
          </Badge>
          <Badge radius="md" variant="default">
            {verified ? 'Верифицирован' : 'Не верифицирован'}
          </Badge>
        </Group>
        <Divider my="md" />
        <Group justify="space-between">
          <Text c="dimmed" size="sm">
            Создан: {new Date(createdAt).toLocaleDateString()}
          </Text>
          <Link to={`/bot/${id}`}>
            <Button
              leftSection={<Settings size={16} />}
              radius="md"
              variant="default"
            >
              Настройки
            </Button>
          </Link>
        </Group>
      </Stack>
    </Card>
  );
};
