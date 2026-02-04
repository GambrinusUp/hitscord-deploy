import { Button, Group, Stack, Text } from '@mantine/core';

interface NotificationMessageProps {
  message: string;
  serverName: string;
  channelName: string;
}

export const NotificationMessage = ({
  message,
  serverName,
  channelName,
}: NotificationMessageProps) => {
  return (
    <Stack gap="xs">
      <Group gap="xs">
        <Text fw={500}>{serverName}</Text>
        <Text># {channelName}</Text>
      </Group>
      <Text>{message}</Text>
      <Button>Перейти к сообщению</Button>
    </Stack>
  );
};
