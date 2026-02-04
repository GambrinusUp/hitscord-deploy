import {
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';

import { DetailsPanelMobileProps } from './DetailsPanelMobile.types';

import { useAppSelector } from '~/hooks';

export const DetailsPanelMobile = ({
  onClose,
  opened,
}: DetailsPanelMobileProps) => {
  const { serverData } = useAppSelector((state) => state.testServerStore);

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
    >
      <Box style={{ padding: '10px', backgroundColor: '#1A1B1E' }} h="100%">
        <Stack gap="md" h="100%">
          <Text c="white">Пользователи</Text>
          <Divider color="gray" />
          <ScrollArea.Autosize mah="100%" maw="100%">
            <Stack gap="xs">
              {serverData.users.map((user) => (
                <Group key={user.userId} wrap="nowrap">
                  <Avatar size="md" color="blue">
                    {user.userName}
                  </Avatar>
                  <Text c="white">{user.userName}</Text>
                  <Badge
                    fullWidth
                    color="green"
                    radius="sm"
                    style={{ marginLeft: 'auto', maxWidth: 100 }}
                  >
                    {'Роль пока недоступна'}
                  </Badge>
                </Group>
              ))}
            </Stack>
          </ScrollArea.Autosize>
        </Stack>
      </Box>
    </Drawer>
  );
};
