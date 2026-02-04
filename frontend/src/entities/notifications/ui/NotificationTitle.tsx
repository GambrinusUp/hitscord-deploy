import { Group, Text } from '@mantine/core';
import { BellRing } from 'lucide-react';

interface NotificationTitleProps {
  title: string;
}

export const NotificationTitle = ({ title }: NotificationTitleProps) => {
  return (
    <Group gap="xs">
      <BellRing />
      <Text>{title}</Text>
    </Group>
  );
};
