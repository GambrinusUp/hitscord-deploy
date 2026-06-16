import type { Bot } from '~/entities/bot/model/types';

import {
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconCircleCheckFilled, IconShieldCheck } from '@tabler/icons-react';
import { BotIcon } from 'lucide-react';

import { stylesBotCard } from './BotCard.style';

interface BotCardProps {
  bot: Bot;
  onAddToServer: (bot: Bot) => void;
}

export const BotCard = ({ bot, onAddToServer }: BotCardProps) => {
  return (
    <Card radius="lg" p="lg" style={stylesBotCard.card()}>
      <Stack gap="md" h="100%">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group align="flex-start" wrap="nowrap">
            <ThemeIcon radius="md" size={42} variant="light" color="cyan">
              <BotIcon size={24} />
            </ThemeIcon>
            <Stack gap={2}>
              <Group gap="xs">
                <Text fw={700}>{bot.name}</Text>
                {bot.verified && (
                  <ThemeIcon color="teal" variant="light" size={20} radius="xl">
                    <IconCircleCheckFilled size={14} />
                  </ThemeIcon>
                )}
              </Group>
              <Text c="dimmed" size="sm">
                {bot.accountTag}
              </Text>
            </Stack>
          </Group>
          <Badge
            variant={bot.verified ? 'light' : 'outline'}
            color={bot.verified ? 'teal' : 'gray'}
          >
            {bot.verified ? 'Проверен' : 'Без верификации'}
          </Badge>
        </Group>

        <Text c="gray.4" size="sm" lineClamp={3}>
          {bot.description}
        </Text>

        <Group style={stylesBotCard.permissionsWrap()}>
          {bot.permissions.map((permission) => (
            <Badge key={permission} variant="dot" color="blue">
              <Group gap="xs" align="center" wrap="nowrap">
                {permission}
                <IconShieldCheck size={12} />
              </Group>
            </Badge>
          ))}
        </Group>

        <Button
          mt="auto"
          variant="gradient"
          gradient={{ from: 'cyan', to: 'blue' }}
          onClick={() => onAddToServer(bot)}
        >
          Добавить на сервер
        </Button>
      </Stack>
    </Card>
  );
};
