import { Drawer, Stack, Text } from '@mantine/core';

import { NotificationsPanelContent } from './NotificationsPanelContent';

type Props = {
  opened: boolean;
  onClose: () => void;
};

export const NotificationsPanelMobile = ({ opened, onClose }: Props) => {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      size="xs"
      position="right"
      styles={{
        content: {
          backgroundColor: '#1A1B1E',
          color: '#ffffff',
        },
        header: {
          backgroundColor: '#1A1B1E',
        },
        body: {
          height: 'calc(100dvh - 60px)',
        },
      }}
      hiddenFrom="sm"
      title={<Text c="white">Уведомления</Text>}
    >
      <Stack h="100%">
        <NotificationsPanelContent onNavigate={onClose} />
      </Stack>
    </Drawer>
  );
};
