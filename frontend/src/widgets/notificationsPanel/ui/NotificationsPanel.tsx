import { ActionIcon, Box, Divider, Group, Stack, Text } from '@mantine/core';
import { X } from 'lucide-react';

import { NotificationsPanelContent } from './NotificationsPanelContent';

type Props = {
  opened: boolean;
  onClose: () => void;
};

export const NotificationsPanel = ({ opened, onClose }: Props) => {
  if (!opened) {
    return null;
  }

  return (
    <Box
      style={{ padding: '10px', backgroundColor: '#1A1B1E' }}
      w={340}
      h="100%"
      visibleFrom="sm"
    >
      <Stack gap="md" h="100%">
        <Group justify="space-between" wrap="nowrap">
          <Text c="white">Уведомления</Text>
          <ActionIcon variant="subtle" color="gray" onClick={onClose}>
            <X size={18} />
          </ActionIcon>
        </Group>
        <Divider color="gray" />
        <NotificationsPanelContent onNavigate={onClose} />
      </Stack>
    </Box>
  );
};
