import { Modal, Stack, TextInput, ColorInput, Button } from '@mantine/core';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ChangeRoleProps } from './ChangeRole.types';

import { useAppDispatch, useNotification, useAppSelector } from '~/hooks';
import { RoleType, setEditedRole, updateRole } from '~/store/RolesStore';
import { updatedRole } from '~/store/ServerStore';

export const ChangeRole = ({ opened, onClose }: ChangeRoleProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { currentServerId } = useAppSelector((state) => state.testServerStore);
  const { role } = useAppSelector((state) => state.rolesStore);
  const [roleName, setRoleName] = useState('');
  const [color, setColor] = useState('');

  const handleChangeRole = async () => {
    if (
      roleName.trim().length > 1 &&
      color.trim().length > 1 &&
      currentServerId &&
      role
    ) {
      const result = await dispatch(
        updateRole({
          updatedRole: {
            serverId: currentServerId,
            roleId: role.role.id,
            name: roleName.trim(),
            color: color.trim(),
          },
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Роль успешно изменена');
        dispatch(
          updatedRole({
            serverId: currentServerId,
            roleId: role.role.id,
            name: roleName.trim(),
            color: color.trim(),
          }),
        );
        dispatch(setEditedRole(null));
        onClose();
      }
    }
  };

  useEffect(() => {
    if (role) {
      setRoleName(role.role.name);
      setColor(role.role.color);
    }
  }, [role]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Изменение роли"
      size="auto"
    >
      <Stack>
        <TextInput
          label="Название роли"
          placeholder="Введите название роли"
          value={roleName}
          onChange={(event) => setRoleName(event.currentTarget.value)}
          disabled={!(role?.role.type === RoleType.Custom)}
        />
        <ColorInput
          withEyeDropper={false}
          label="Выберите цвет"
          placeholder="#000000"
          value={color}
          onChange={setColor}
        />
        <Button
          leftSection={<Save />}
          variant="light"
          radius="md"
          onClick={handleChangeRole}
        >
          Изменить
        </Button>
      </Stack>
    </Modal>
  );
};
