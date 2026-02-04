import { Divider, Drawer, Group, Menu, Skeleton, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, Copy, DoorOpen, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { SideBarMobileProps } from './SideBarMobile.types';

import { useAppDispatch, useAppSelector } from '~/hooks';
import { Panel } from '~/modules/SideBar/components/Panel';
import { ServerSettingsModal } from '~/modules/SideBar/components/ServerSettingsModal';
import { TextChannels } from '~/modules/TextChannels';
import { VoiceChannels } from '~/modules/VoiceChannels';
import { setOpenHome } from '~/store/AppStore/AppStore.reducer';
import {
  getUserServers,
  unsubscribeFromServer,
} from '~/store/ServerStore/ServerStore.actions';
import { clearServerData } from '~/store/ServerStore/ServerStore.reducer';

export const SideBarMobile = ({ onClose, opened }: SideBarMobileProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openedModal, { open, close }] = useDisclosure(false);
  const { serverData, isLoading } = useAppSelector(
    (state) => state.testServerStore,
  );
  const isAdmin = serverData.isCreator;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleUnsubscribe = async () => {
    const result = await dispatch(
      unsubscribeFromServer({ serverId: serverData.serverId }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(getUserServers());
      dispatch(setOpenHome(true));
      dispatch(clearServerData());
      navigate('/main');
    }
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={onClose}
        size="xs"
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
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Group justify="space-between" style={{ cursor: 'pointer' }}>
              {isLoading ? (
                <Skeleton height={10} width="40%" radius="md" />
              ) : (
                <Text>{serverData.serverName}</Text>
              )}
              <ChevronDown />
            </Group>
          </Menu.Target>
          <Menu.Dropdown>
            {isAdmin && (
              <Menu.Item leftSection={<Settings size={16} />} onClick={open}>
                Настройки сервера
              </Menu.Item>
            )}
            <Menu.Item
              onClick={() => copyToClipboard(serverData.serverId)}
              leftSection={<Copy size={16} />}
            >
              Копировать ID сервера
            </Menu.Item>
            {!isAdmin && (
              <Menu.Item
                onClick={handleUnsubscribe}
                leftSection={<DoorOpen size={16} />}
              >
                Отписаться от сервера
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
        <Divider />
        <TextChannels onClose={onClose} />
        <VoiceChannels />
        <Panel />
      </Drawer>
      <ServerSettingsModal opened={openedModal} onClose={close} />
    </>
  );
};
