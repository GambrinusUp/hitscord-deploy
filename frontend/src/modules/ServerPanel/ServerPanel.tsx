import { ActionIcon, Divider, Flex, ScrollArea, Stack } from '@mantine/core';
import { Home, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ServerItem } from './components/ServerItem';

import { useMediaContext } from '~/context';
import { logoutUser } from '~/entities/user';
import { CreateServer } from '~/features/server';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setOpenHome } from '~/store/AppStore';
import { getUserServers } from '~/store/ServerStore';

export const ServerPanel = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isConnected } = useMediaContext();
  const { serversList } = useAppSelector((state) => state.testServerStore);
  const { accessToken } = useAppSelector((state) => state.userStore);

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  useEffect(() => {
    if (accessToken) {
      dispatch(getUserServers());
    }
  }, [accessToken, dispatch]);

  return (
    <Flex
      w="100%"
      h="100%"
      maw={70}
      bg="#0E0E10"
      align="center"
      direction="column"
      justify="space-between"
      p={`10px 0 ${isConnected ? 130 : 85}px 0`}
    >
      <Flex direction="column" align="center" h="calc(100% - 40px)">
        <ActionIcon
          size="lg"
          variant="transparent"
          onClick={() => dispatch(setOpenHome(true))}
        >
          <Home size={28} color="#fff" />
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
      <ActionIcon size="lg" variant="transparent" onClick={handleLogout}>
        <LogOut size={28} color="#fff" />
      </ActionIcon>
    </Flex>
  );
};
