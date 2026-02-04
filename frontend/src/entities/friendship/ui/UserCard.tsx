import { Avatar, Card, Group, Stack, Text } from '@mantine/core';

interface UserCardProps {
  userName: string;
  userTag: string;
  actions: React.ReactNode;
}

export const UserCard = ({ userName, userTag, actions }: UserCardProps) => {
  return (
    <Card bg="#2c2e33" padding="xs" radius="md" withBorder>
      <Group justify="space-between">
        <Group>
          <Avatar size="md" color="blue">
            {userName[0]}
          </Avatar>
          <Stack gap="xs">
            <Text c="white">{userName}</Text>
            <Text c="dimmed">{userTag}</Text>
          </Stack>
        </Group>
        <Group>{actions}</Group>
      </Group>
    </Card>
  );
};
