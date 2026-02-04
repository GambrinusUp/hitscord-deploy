import { ActionIcon, Divider, Flex, ScrollArea, Stack } from '@mantine/core';
import { Home } from 'lucide-react';
import { useEffect } from 'react';

import { CreateServer } from '~/features/server/createServer';
import { Logout } from '~/features/user/logout';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { ServerItem } from '~/modules/ServerPanel/components/ServerItem';
import { setOpenHome } from '~/store/AppStore';
import { getUserServers } from '~/store/ServerStore';

export const ServerList = () => {
  const dispatch = useAppDispatch();
  const { serversList } = useAppSelector((state) => state.testServerStore);

  useEffect(() => {
    dispatch(getUserServers());
  }, [dispatch]);

  return (
    <Flex
      w="100%"
      h="100%"
      maw={80}
      bg="#0E0E10"
      align="center"
      direction="column"
      justify="space-between"
      p="10px 0"
    >
      <Flex direction="column" align="center" h="calc(100% - 40px)">
        <ActionIcon
          size="lg"
          variant="transparent"
          onClick={() => dispatch(setOpenHome(true))}
        >
          <Home size={24} color="#fff" />
        </ActionIcon>
        <Divider my="sm" />
        <ScrollArea.Autosize mah="100%">
          <Stack gap="sm" align="center">
            {serversList.map((server) => (
              <ServerItem
                key={server.serverId}
                serverId={server.serverId}
                serverName={server.serverName}
                nonReadedCount={server.nonReadedCount}
                nonReadedTaggedCount={server.nonReadedTaggedCount}
                serverIcon={server.icon}
              />
            ))}
          </Stack>
        </ScrollArea.Autosize>
        <Divider my="sm" />
        <CreateServer />
      </Flex>
      <Logout />
    </Flex>
  );
};
