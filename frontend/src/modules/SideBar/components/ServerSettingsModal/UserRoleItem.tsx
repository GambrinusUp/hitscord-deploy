import {
  ActionIcon,
  Avatar,
  Card,
  Group,
  Pill,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { useIcon } from '~/shared/lib/hooks';
import { RoleType } from '~/store/RolesStore';
import { addRole, removeRole, UserOnServer } from '~/store/ServerStore';

export interface UserRoleItemProps {
  user: UserOnServer;
}

export const UserRoleItem = ({ user }: UserRoleItemProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { serverData, currentServerId } = useAppSelector(
    (state) => state.testServerStore,
  );

  const { iconBase64 } = useIcon(user.icon?.fileId);

  const [loading, setLoading] = useState(false);
  const [newRole, setNewRole] = useState<string | null>(null);

  const { roles } = serverData;
  const rolesValues = roles
    .filter((role) => role.type !== RoleType.Creator)
    .map((role) => {
      return {
        value: role.id,
        label: role.name,
      };
    });

  const handleAddRole = async () => {
    setLoading(true);

    if (newRole && currentServerId) {
      const result = await dispatch(
        addRole({
          serverId: currentServerId,
          userId: user.userId,
          role: newRole,
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Роль успешно присвоена пользователю');
      }
    }

    setLoading(false);
  };

  const handleRemoveRole = async (removedRoleId: string) => {
    setLoading(true);

    if (currentServerId) {
      const result = await dispatch(
        removeRole({
          serverId: currentServerId,
          userId: user.userId,
          role: removedRoleId,
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Роль успешно убрана у пользователя');
      }
    }

    setLoading(false);
  };

  return (
    <Card radius="md">
      <Stack gap="md">
        <Group>
          <Avatar size={40} radius="xl" src={iconBase64} alt={user.userName} />
          <Stack gap="0">
            <Text fw={700}>{user.userName}</Text>
            <Text c="dimmed">{user.userTag}</Text>
          </Stack>
        </Group>
        <Pill.Group>
          {user.roles.map((role) => (
            <Pill
              key={role.roleId}
              withRemoveButton={user.roles.length > 1}
              onRemove={() => handleRemoveRole(role.roleId)}
              disabled={loading}
              /*styles={{
                root: {
                  background: getRoleColor(role.roleId),
                },
              }}*/
            >
              {role.roleName}
            </Pill>
          ))}
        </Pill.Group>
        <Group gap="md">
          <Select
            placeholder="Выберите роль"
            value={newRole}
            onChange={setNewRole}
            data={rolesValues}
          />
          <ActionIcon size="lg" onClick={handleAddRole} disabled={loading}>
            <Plus size={24} color="#fff" />
          </ActionIcon>
        </Group>
      </Stack>
    </Card>
  );
};
