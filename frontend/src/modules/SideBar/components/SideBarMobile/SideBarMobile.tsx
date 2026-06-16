import {
  Divider,
  Drawer,
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

import { SideBarMobileProps } from './SideBarMobile.types';

import { ServerTypeEnum } from '~/entities/servers';
import { ManagePresetsModal } from '~/features/presets';
import { ChangeNotificationSetting, CreateInvitation } from '~/features/server';
import { useAppDispatch, useAppSelector, useDisconnect } from '~/hooks';
import { ChangeNameModal } from '~/modules/SideBar/components/ChangeNameModal';
import { Panel } from '~/modules/SideBar/components/Panel';
import { RolesModal } from '~/modules/SideBar/components/RolesModal';
import { RolesPermissionsModal } from '~/modules/SideBar/components/RolesPermissionsModal';
import { ServerSettingsModal } from '~/modules/SideBar/components/ServerSettingsModal';
import { UnsubscribeModal } from '~/modules/SideBar/components/UnsubscribeModal';
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
  setCurrentVoiceChannelName,
  setCurrentVoiceChannelServerId,
} from '~/store/ServerStore/ServerStore.reducer';
import { NotificationChannels } from '~/widgets/notificationChannels';

export const SideBarMobile = ({
  onClose,
  opened,
}: SideBarMobileProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const disconnect = useDisconnect();
  const [settingsOpened, { open: openSettings, close: closeSettings }] =
    useDisclosure(false);
  const [
    changeNameModalOpened,
    { open: openChangeNameModal, close: closeChangeNameModal },
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
      open: openChangeNotificationSetting,
      close: closeChangeNotificationSetting,
    },
  ] = useDisclosure(false);
  const [
    createInvitationModalOpened,
    { open: openCreateInvitation, close: closeCreateInvitation },
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
    if (currentVoiceChannelId) {
      disconnect(accessToken, currentVoiceChannelId);
    }

    dispatch(setUserStreamView(false));
    dispatch(setCurrentVoiceChannelId(null));
    dispatch(setCurrentVoiceChannelName(null));
    dispatch(setCurrentVoiceChannelServerId(null));

    const result = await dispatch(
      unsubscribeFromServer({ serverId: serverData.serverId }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(getUserServers());
      dispatch(setOpenHome(true));
      dispatch(clearServerData());
      onClose();
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
        <Stack h="100%" gap="xs">
          <Menu shadow="md" width={220}>
            <Menu.Target>
              <Tooltip label={serverData.serverName}>
                <Group justify="space-between" style={{ cursor: 'pointer' }} wrap="nowrap">
                  <Group gap="xs" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
                    {isLoading ? (
                      <Skeleton height={10} width="40%" radius="md" />
                    ) : (
                      <Text lineClamp={1} style={{ maxWidth: 180 }}>
                        {serverData.serverName}
                      </Text>
                    )}
                  </Group>
                  <ChevronDown />
                </Group>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
              {(canChangeRole || isCreator || canDeleteUsers) && (
                <Menu.Item
                  leftSection={<Settings size={16} />}
                  onClick={openSettings}
                >
                  Настройки сервера
                </Menu.Item>
              )}
              {isCreator && isTeacherServer && (
                <Menu.Item
                  onClick={openManagePresetsModal}
                  leftSection={<BookUser size={16} />}
                >
                  Пресеты ролей
                </Menu.Item>
              )}
              {(canChangeRole || canCreateRole) && (
                <Menu.Item
                  onClick={openRolesModal}
                  leftSection={<Users size={16} />}
                >
                  Настройки ролей
                </Menu.Item>
              )}
              <Menu.Item
                onClick={openRolesPermissionsModal}
                leftSection={<ListChecks size={16} />}
              >
                Просмотр разрешений
              </Menu.Item>
              <Menu.Item
                onClick={openChangeNameModal}
                leftSection={<UserPen size={16} />}
              >
                Изменить имя на сервере
              </Menu.Item>
              <Menu.Item
                onClick={openChangeNotificationSetting}
                leftSection={<Bell size={16} />}
              >
                Настройка уведомлений
              </Menu.Item>
              {canCreateInvitation && (
                <Menu.Item
                  onClick={openCreateInvitation}
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
                  onClick={openUnsubscribeModal}
                  leftSection={<DoorOpen size={16} />}
                >
                  Отписаться от сервера
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
          <Divider />
          <ScrollArea.Autosize mah="100%" style={{ flex: 1 }}>
            <Stack gap="xs" pb="sm">
              <TextChannels onClose={onClose} />
              <NotificationChannels />
              <VoiceChannels />
            </Stack>
          </ScrollArea.Autosize>
          <Panel />
        </Stack>
      </Drawer>
      <ServerSettingsModal opened={settingsOpened} onClose={closeSettings} />
      <ChangeNameModal
        opened={changeNameModalOpened}
        onClose={closeChangeNameModal}
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
        onClose={closeChangeNotificationSetting}
      />
      <CreateInvitation
        opened={createInvitationModalOpened}
        onClose={closeCreateInvitation}
      />
    </>
  );
};
