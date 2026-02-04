import { Box, Divider, ScrollArea, Stack, Text } from '@mantine/core';

import { UserItem } from './UserItem';

import { useAppSelector } from '~/hooks';

export const DetailsPanel = () => {
  const { serverData } = useAppSelector((state) => state.testServerStore);

  return (
    <Box
      style={{ padding: '10px', backgroundColor: '#1A1B1E' }}
      w={300}
      h="100%"
      visibleFrom="sm"
    >
      <Stack gap="md" h="100%">
        <Text c="white">Пользователи</Text>
        <Divider color="gray" />
        <ScrollArea.Autosize mah="100%" maw="100%">
          <Stack gap="xs">
            {serverData.users.map((user) => (
              <UserItem key={user.userId} user={user} />
            ))}
          </Stack>
        </ScrollArea.Autosize>
      </Stack>
    </Box>
  );
};
