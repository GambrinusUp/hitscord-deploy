import {
  ActionIcon,
  Box,
  Divider,
  Drawer,
  Flex,
  Indicator,
  Popover,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Bell, BotIcon, Home, LogOut, X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ServerItem } from './components/ServerItem';

import { useMediaContext } from '~/context';
import { logoutUser } from '~/entities/user';
import { CreateServer } from '~/features/server';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setOpenHome } from '~/store/AppStore';
import { getUserServers } from '~/store/ServerStore';
import { NotificationsPanelContent } from '~/widgets/notificationsPanel/ui/NotificationsPanelContent';

export const ServerPanel = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isConnected } = useMediaContext();
  const { serversList } = useAppSelector((state) => state.testServerStore);
  const { isLoggedIn } = useAppSelector((state) => state.userStore);
  const unreadCount = useAppSelector(
    (state) =>
      state.notificationsStore.items.filter((item) => !item.isReaded).length,
  );
  const [desktopOpened, desktopHandlers] = useDisclosure(false);
  const [mobileOpened, mobileHandlers] = useDisclosure(false);

  const notificationLabel = useMemo(() => {
    if (unreadCount > 99) {
      return '99+';
    }

    return unreadCount > 0 ? String(unreadCount) : undefined;
  }, [unreadCount]);

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  const handleOpenBots = () => {
    navigate('/bots');
  };

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUserServers());
    }
  }, [isLoggedIn, dispatch]);

  return (
    <>
      <Flex
        w="100%"
        h="100%"
        maw={70}
        bg="#0E0E10"
        align="center"
        direction="column"
        justify="space-between"
         p={{
          base: '10px 0 10px 0',
          sm: `10px 0 ${isConnected ? 130 : 85}px 0`,
        }}
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
        <Stack gap="xs" align="center">
          <Box visibleFrom="sm">
            <Popover
              opened={desktopOpened}
              onChange={desktopHandlers.toggle}
              width={360}
              position="right-end"
              withArrow
              shadow="md"
              offset={12}
              zIndex={250}
              withinPortal
            >
              <Popover.Target>
                <Indicator
                  disabled={!notificationLabel}
                  label={notificationLabel}
                  color="red"
                  size={16}
                  offset={4}
                >
                  <ActionIcon
                    size="lg"
                    variant="transparent"
                    onClick={desktopHandlers.toggle}
                  >
                    <Bell size={28} color="#fff" />
                  </ActionIcon>
                </Indicator>
              </Popover.Target>
              <Popover.Dropdown
                p={0}
                style={{
                  backgroundColor: '#1A1B1E',
                  border: '1px solid #2C2E33',
                  overflow: 'hidden',
                }}
              >
                <Stack gap={0} h={480}>
                  <Flex
                    align="center"
                    justify="space-between"
                    px="md"
                    py="sm"
                    style={{ borderBottom: '1px solid #2C2E33' }}
                  >
                    <Text c="white" fw={600}>
                      Уведомления
                    </Text>
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={desktopHandlers.close}
                    >
                      <X size={18} />
                    </ActionIcon>
                  </Flex>
                  <Flex flex={1} mih={0}>
                    <NotificationsPanelContent
                      onNavigate={desktopHandlers.close}
                    />
                  </Flex>
                </Stack>
              </Popover.Dropdown>
            </Popover>
          </Box>

          <Indicator
            disabled={!notificationLabel}
            label={notificationLabel}
            color="red"
            size={16}
            offset={4}
            hiddenFrom="sm"
          >
            <ActionIcon
              size="lg"
              variant="transparent"
              hiddenFrom="sm"
              onClick={mobileHandlers.open}
            >
              <Bell size={28} color="#fff" />
            </ActionIcon>
          </Indicator>

          <ActionIcon size="lg" variant="transparent" onClick={handleOpenBots}>
            <BotIcon size={28} color="#fff" />
          </ActionIcon>
          <ActionIcon size="lg" variant="transparent" onClick={handleLogout}>
            <LogOut size={28} color="#fff" />
          </ActionIcon>
        </Stack>
      </Flex>

      <Drawer
        opened={mobileOpened}
        onClose={mobileHandlers.close}
        position="right"
        hiddenFrom="sm"
        title={<Text c="white">Уведомления</Text>}
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
        <Stack h="100%">
          <NotificationsPanelContent onNavigate={mobileHandlers.close} />
        </Stack>
      </Drawer>
    </>
  );
};
