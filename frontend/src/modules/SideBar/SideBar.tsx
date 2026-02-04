import {
  Divider,
  Group,
  Menu,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMailOpened } from '@tabler/icons-react';
import {
  Bell,
  BookUser,
  ChevronDown,
  DoorOpen,
  ListChecks,
  Settings,
  UserPen,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ChangeNameModal } from './components/ChangeNameModal';
import { RolesModal } from './components/RolesModal';
import { RolesPermissionsModal } from './components/RolesPermissionsModal';
import { ServerSettingsModal } from './components/ServerSettingsModal';
import { UnsubscribeModal } from './components/UnsubscribeModal';
import { SideBarProps } from './SideBarProps.types';

import { useMediaContext } from '~/context';
import { ServerTypeEnum } from '~/entities/servers';
import { ManagePresetsModal } from '~/features/presets';
import { ChangeNotificationSetting, CreateInvitation } from '~/features/server';
import { useAppDispatch, useAppSelector, useDisconnect } from '~/hooks';
import { TextChannels } from '~/modules/TextChannels';
import { VoiceChannels } from '~/modules/VoiceChannels';
import {
  setOpenHome,
  setUserStreamView,
} from '~/store/AppStore/AppStore.reducer';
import {
  getUserServers,
  unsubscribeFromServer,
} from '~/store/ServerStore/ServerStore.actions';
import {
  clearServerData,
  setCurrentVoiceChannelId,
} from '~/store/ServerStore/ServerStore.reducer';
import { NotificationChannels } from '~/widgets/notificationChannels';

export const SideBar = ({ onClose }: SideBarProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const disconnect = useDisconnect();
  const { isConnected } = useMediaContext();
  const [opened, { open, close }] = useDisclosure(false);
  const [
    changeNameModalOpened,
    { open: openChangeNameModalOpened, close: closeChangeNameModalOpened },
  ] = useDisclosure(false);
  const [
    unsubscribeModalOpened,
    { open: openUnsubscribeModal, close: closeUnsubscribeModal },
  ] = useDisclosure(false);
  const [rolesModalOpened, { open: openRolesModal, close: closeRolesModal }] =
    useDisclosure(false);
  const [
    rolesPermissionsModalOpened,
    { open: openRolesPermissionsModal, close: closeRolesPermissionsModal },
  ] = useDisclosure(false);
  const [
    managePresetsModalOpened,
    { open: openManagePresetsModal, close: closeManagePresetsModal },
  ] = useDisclosure(false);
  const [
    changeNotificationSettingOpened,
    {
      open: openChangeNotificationSettingModal,
      close: closeChangeNotificationSettingModal,
    },
  ] = useDisclosure(false);
  const [
    createInvitationModalOpened,
    { open: openCreateInvitationModal, close: closeCreateInvitationModal },
  ] = useDisclosure(false);
  const { serverData, isLoading, currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { accessToken } = useAppSelector((state) => state.userStore);
  const canChangeRole = serverData.permissions.canChangeRole;
  const canDeleteUsers = serverData.permissions.canDeleteUsers;
  const canCreateRole = serverData.permissions.canCreateRoles;
  const canCreateInvitation = serverData.permissions.canUseInvitations;
  const isCreator = serverData.isCreator;
  const isTeacherServer = serverData.serverType === ServerTypeEnum.Teacher;

  const handleUnsubscribe = async () => {
    disconnect(accessToken, currentVoiceChannelId!);
    dispatch(setUserStreamView(false));
    dispatch(setCurrentVoiceChannelId(null));

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
      <Stack
        gap="xs"
        bg="#1A1B1E"
        p={`10px 10px ${isConnected ? 130 : 85}px 10px`}
        //w={{ base: 150, lg: 250 }}
        miw={250}
        h="100%"
        visibleFrom="sm"
      >
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Tooltip label={serverData.serverName}>
              <Group justify="space-between" style={{ cursor: 'pointer' }}>
                {isLoading ? (
                  <Skeleton height={10} width="40%" radius="md" />
                ) : (
                  <Text
                    style={{
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      maxWidth: 190,
                    }}
                    lineClamp={1}
                  >
                    {serverData.serverName}
                  </Text>
                )}
                <ChevronDown />
              </Group>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            {(canChangeRole || isCreator || canDeleteUsers) && (
              <Menu.Item leftSection={<Settings size={16} />} onClick={open}>
                Настройки сервера
              </Menu.Item>
            )}
            {isCreator && isTeacherServer && (
              <Menu.Item
                onClick={() => openManagePresetsModal()}
                leftSection={<BookUser size={16} />}
              >
                Пресеты ролей
              </Menu.Item>
            )}
            {(canChangeRole || canCreateRole) && (
              <Menu.Item
                onClick={() => openRolesModal()}
                leftSection={<Users size={16} />}
              >
                Настройки ролей
              </Menu.Item>
            )}
            <Menu.Item
              onClick={() => openRolesPermissionsModal()}
              leftSection={<ListChecks size={16} />}
            >
              Просмотр разрешений
            </Menu.Item>
            <Menu.Item
              onClick={openChangeNameModalOpened}
              leftSection={<UserPen size={16} />}
            >
              Изменить имя на сервере
            </Menu.Item>
            <Menu.Item
              onClick={openChangeNotificationSettingModal}
              leftSection={<Bell size={16} />}
            >
              Настройка уведомлений
            </Menu.Item>
            {canCreateInvitation && (
              <Menu.Item
                onClick={openCreateInvitationModal}
                leftSection={<IconMailOpened size={16} />}
              >
                Создать приглашение
              </Menu.Item>
            )}
            {!isCreator && (
              <Menu.Item
                onClick={handleUnsubscribe}
                leftSection={<DoorOpen size={16} />}
              >
                Отписаться от сервера
              </Menu.Item>
            )}
            {isCreator && (
              <Menu.Item
                onClick={() => openUnsubscribeModal()}
                leftSection={<DoorOpen size={16} />}
              >
                Отписаться от сервера
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
        <Divider />
        <ScrollArea.Autosize mah="100%" maw="100%" scrollbarSize={0}>
          <TextChannels onClose={onClose} />
          <NotificationChannels />
          <VoiceChannels />
        </ScrollArea.Autosize>
      </Stack>
      <ServerSettingsModal opened={opened} onClose={close} />
      <ChangeNameModal
        opened={changeNameModalOpened}
        onClose={closeChangeNameModalOpened}
      />
      <UnsubscribeModal
        opened={unsubscribeModalOpened}
        onClose={closeUnsubscribeModal}
      />
      <RolesModal opened={rolesModalOpened} onClose={closeRolesModal} />
      <RolesPermissionsModal
        opened={rolesPermissionsModalOpened}
        onClose={closeRolesPermissionsModal}
      />
      <ManagePresetsModal
        opened={managePresetsModalOpened}
        onClose={closeManagePresetsModal}
      />
      <ChangeNotificationSetting
        opened={changeNotificationSettingOpened}
        onClose={closeChangeNotificationSettingModal}
      />
      <CreateInvitation
        opened={createInvitationModalOpened}
        onClose={closeCreateInvitationModal}
      />
    </>
  );
};
