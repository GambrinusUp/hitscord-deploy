import {
  Button,
  Group,
  Modal,
  NavLink,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import {
  FileUser,
  ImageUp,
  LockOpen,
  Plus,
  Trash,
  UserCheck,
  UserMinus,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { ServerSettingsModalProps } from './ServerSettingsModal.types';
import { UserRoleItem } from './UserRoleItem';

import {
  ChangeServerIsClosed,
  DeleteServer,
  ServerApplications,
  UnbanUser,
} from '~/features/server';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { IconChange } from '~/modules/SideBar/components/IconChange';
import { LoadingState } from '~/shared';
import { getRoles } from '~/store/RolesStore';
import { changeServerName, deleteUserFromServer } from '~/store/ServerStore';

export const ServerSettingsModal = ({
  opened,
  onClose,
}: ServerSettingsModalProps) => {
  const dispatch = useAppDispatch();
  const { serverData, currentServerId, error } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { rolesLoading } = useAppSelector((state) => state.rolesStore);
  const { user } = useAppSelector((state) => state.userStore);
  const [activeSetting, setActiveSetting] = useState<
    | 'name'
    | 'roles'
    | 'deleteUser'
    | 'unbanUser'
    | 'changeIcon'
    | 'changeIsClosed'
    | 'serverApplications'
    | 'deleteServer'
  >('roles');
  //const [assignRoleUserId, setAssignRoleUserId] = useState<string | null>('');
  //const [assignRoleId, setAssignRoleId] = useState<string | null>('');
  const [loading, setLoading] = useState(false);
  const [newServerName, setNewServerName] = useState(serverData.serverName);
  const { showSuccess } = useNotification();
  const [deletedUserId, setDeletedUserId] = useState<string | null>('');
  const [banReason, setBanReason] = useState<string>('');
  const isCreator = serverData.isCreator;
  const canDeleteUsers = serverData.permissions.canDeleteUsers;
  const canChangeRole = serverData.permissions.canChangeRole;
  const canCreateRoles = serverData.permissions.canCreateRoles;
  const users = serverData.users;
  const serverIsClosed = serverData.isClosed;

  /*const assignRole = async () => {
    if (!assignRoleUserId || !assignRoleId) return;
    setLoading(true);
    const result = await dispatch(
      changeRole({
        accessToken,
        serverId: serverData.serverId,
        userId: assignRoleUserId,
        role: assignRoleId,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      setLoading(false);
      showSuccess('Роль успешно присвоена');
      dispatch(getServerData({ serverId: serverData.serverId }));
      onClose();
    }
  };
*/
  const handleChangeServerName = async () => {
    if (newServerName.length < 6) {
      return;
    }

    if (currentServerId) {
      setLoading(true);

      const result = await dispatch(
        changeServerName({
          serverId: currentServerId,
          name: newServerName,
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setLoading(false);
        showSuccess('Название успешно изменено');
        onClose();
      }
    }
  };

  const handleDeleteUser = async () => {
    if (currentServerId && deletedUserId) {
      setLoading(true);

      const result = await dispatch(
        deleteUserFromServer({
          serverId: currentServerId,
          userId: deletedUserId,
          banReason: banReason.trim() !== '' ? banReason : undefined,
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setLoading(false);
        showSuccess('Пользователь успешно удалён');
        setDeletedUserId(null);
        setBanReason('');
        onClose();
      }
    }
  };

  useEffect(() => {
    if (
      canCreateRoles &&
      rolesLoading === LoadingState.IDLE &&
      currentServerId
    ) {
      //console.log(canCreateRoles);
      dispatch(getRoles({ serverId: currentServerId }));
    }
  }, [rolesLoading, canCreateRoles, currentServerId]);

  useEffect(() => {
    if (error) {
      setLoading(false);
    }
  }, [error]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Настройки сервера"
      size="auto"
    >
      <Group align="flex-start" gap="md">
        <Stack gap="xs" style={{ width: 200 }}>
          {canChangeRole && (
            <NavLink
              label="Роли"
              leftSection={<Plus size={16} />}
              active={activeSetting === 'roles'}
              onClick={() => setActiveSetting('roles')}
            />
          )}
          {isCreator && (
            <NavLink
              label="Название сервера"
              leftSection={<Plus size={16} />}
              active={activeSetting === 'name'}
              onClick={() => setActiveSetting('name')}
            />
          )}
          {(isCreator || canDeleteUsers) && (
            <NavLink
              label="Удаление пользователя"
              leftSection={<UserMinus size={16} />}
              active={activeSetting === 'deleteUser'}
              onClick={() => setActiveSetting('deleteUser')}
            />
          )}
          {canDeleteUsers && (
            <NavLink
              label="Разблокирование пользователя"
              leftSection={<UserCheck size={16} />}
              active={activeSetting === 'unbanUser'}
              onClick={() => setActiveSetting('unbanUser')}
            />
          )}
          {isCreator && (
            <NavLink
              label="Загрузка иконки"
              leftSection={<ImageUp size={16} />}
              active={activeSetting === 'changeIcon'}
              onClick={() => setActiveSetting('changeIcon')}
            />
          )}
          {isCreator && (
            <NavLink
              label="Изменить закрытость сервера"
              leftSection={<LockOpen size={16} />}
              active={activeSetting === 'changeIsClosed'}
              onClick={() => setActiveSetting('changeIsClosed')}
            />
          )}
          {serverIsClosed && (
            <NavLink
              label="Заявки на вступление"
              leftSection={<FileUser size={16} />}
              active={activeSetting === 'serverApplications'}
              onClick={() => setActiveSetting('serverApplications')}
            />
          )}
          {isCreator && (
            <NavLink
              label="Удаление сервера"
              leftSection={<Trash size={16} />}
              active={activeSetting === 'deleteServer'}
              onClick={() => setActiveSetting('deleteServer')}
            />
          )}
        </Stack>
        <ScrollArea>
          {activeSetting === 'roles' && (
            <ScrollArea.Autosize mah={400} miw={500} mx="auto">
              <Stack gap="md">
                {users.map((user) => (
                  <UserRoleItem key={user.userId} user={user} />
                ))}
              </Stack>
            </ScrollArea.Autosize>
          )}
          {activeSetting === 'name' && isCreator && (
            <Stack gap="md">
              <Text size="lg" w={500}>
                Изменить название сервера
              </Text>
              <TextInput
                label="Новое название сервера"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                placeholder={serverData.serverName}
                description="от 6 до 50 символов"
                maxLength={50}
              />
              <Button onClick={handleChangeServerName} loading={loading}>
                Изменить название
              </Button>
            </Stack>
          )}
          {activeSetting === 'deleteUser' && (isCreator || canDeleteUsers) && (
            <Stack gap="md">
              <Text size="lg" w={500}>
                Удалить пользователя с сервера
              </Text>
              <Select
                label="Выбор пользователя"
                placeholder="Выберите пользователя"
                data={serverData.users
                  .filter((userOnServer) => userOnServer.userId !== user.id)
                  /*.filter(
                    (userOnServer) =>
                      userOnServer.roleType !== RoleType.Creator,
                  )*/
                  /*.filter(
                    (userOnServer) =>
                      Number(userOnServer.roleType) >=
                      Number(serverData.userRoleType),
                  )*/
                  .map((userOnServer) => ({
                    value: userOnServer.userId,
                    label: userOnServer.userName,
                  }))}
                value={deletedUserId}
                onChange={setDeletedUserId}
              />
              <TextInput
                label="Введите причину бана (необязательно)"
                placeholder="Причина бана"
                value={banReason}
                onChange={(event) => setBanReason(event.currentTarget.value)}
              />
              <Button onClick={handleDeleteUser} loading={loading}>
                Удалить
              </Button>
            </Stack>
          )}
          {activeSetting === 'unbanUser' && canDeleteUsers && (
            <UnbanUser
              opened={opened}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          {activeSetting === 'changeIcon' && <IconChange />}
          {activeSetting === 'changeIsClosed' && <ChangeServerIsClosed />}
          {activeSetting === 'serverApplications' && <ServerApplications />}
          {activeSetting === 'deleteServer' && <DeleteServer />}
        </ScrollArea>
      </Group>
    </Modal>
  );
};
