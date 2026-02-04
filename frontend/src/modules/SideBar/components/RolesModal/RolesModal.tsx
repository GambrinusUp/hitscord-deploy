import { Button, Group, Modal, ScrollArea, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';

import { RolesModalProps } from './RolesModal.types';

import { useAppDispatch, useAppSelector } from '~/hooks';
import { ChangeRole } from '~/modules/SideBar/components/ChangeRole';
import { ChangeRoleSettings } from '~/modules/SideBar/components/ChangeRoleSettings';
import { CreateRole } from '~/modules/SideBar/components/CreateRole';
import { RoleItem } from '~/modules/SideBar/components/RoleItem';
import { getRoles, setEditedRole } from '~/store/RolesStore';

export const RolesModal = ({ opened, onClose }: RolesModalProps) => {
  const dispatch = useAppDispatch();
  const [
    createRoleModalOpened,
    { open: openCreateRoleModal, close: closeCreateRoleModal },
  ] = useDisclosure(false);
  const [
    settingsRoleModalOpened,
    { open: openSettingsRoleModal, close: closeSettingsRoleModal },
  ] = useDisclosure(false);
  const [
    changeRoleModalOpened,
    { open: openChangeRoleModal, close: closeChangeRoleModal },
  ] = useDisclosure(false);
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { currentServerId, serverData } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { rolesList } = useAppSelector((state) => state.rolesStore);
  const canCreateRoles = serverData.permissions.canCreateRoles;

  useEffect(() => {
    if (accessToken && currentServerId && canCreateRoles) {
      dispatch(getRoles({ serverId: currentServerId }));
    }
  }, [accessToken, currentServerId, canCreateRoles]);

  return (
    <>
      <Modal opened={opened} onClose={onClose} centered size="auto">
        <Stack>
          <Group justify="space-between">
            <Title order={3}>Настройки ролей</Title>
            {canCreateRoles && (
              <Button
                leftSection={<Plus />}
                variant="light"
                radius="md"
                onClick={() => openCreateRoleModal()}
                disabled={!serverData.permissions.canCreateRoles}
              >
                Создать роль
              </Button>
            )}
          </Group>
          <ScrollArea.Autosize mah="700px" maw="100%">
            <Stack>
              {rolesList.map((role) => (
                <RoleItem
                  key={role.role.id}
                  role={role}
                  editRole={(role) => {
                    dispatch(setEditedRole(role));
                    openChangeRoleModal();
                  }}
                  editSettings={(role) => {
                    dispatch(setEditedRole(role));
                    openSettingsRoleModal();
                  }}
                />
              ))}
            </Stack>
          </ScrollArea.Autosize>
        </Stack>
      </Modal>
      <CreateRole
        opened={createRoleModalOpened}
        onClose={closeCreateRoleModal}
      />
      <ChangeRoleSettings
        opened={settingsRoleModalOpened}
        onClose={closeSettingsRoleModal}
      />
      <ChangeRole
        opened={changeRoleModalOpened}
        onClose={closeChangeRoleModal}
      />
    </>
  );
};
