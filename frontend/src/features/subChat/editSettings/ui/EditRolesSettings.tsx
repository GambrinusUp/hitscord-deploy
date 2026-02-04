import { Button, Group, Select, Stack, Text } from '@mantine/core';
import { useState } from 'react';

import { toBoolean } from '~/features/channels/editChannel/lib';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { RoleType } from '~/store/RolesStore';
import { changeSubChannelSettings } from '~/store/ServerStore';

interface EditRolesSettingsProps {
  onClose: () => void;
}

export const EditRolesSettings = ({ onClose }: EditRolesSettingsProps) => {
  const dispatch = useAppDispatch();
  const { currentChannelId, serverData } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { currentSubChatId } = useAppSelector((state) => state.subChatStore);
  const { showSuccess } = useNotification();
  const [add, setAdd] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [assignRoleId, setAssignRoleId] = useState<string | null>('');

  const channel = serverData.channels.textChannels.find(
    (channel) => channel.channelId === currentChannelId,
  );

  const roles = channel ? channel.rolesCanWrite : [];

  const handleChangeChannelSettings = async () => {
    setLoading(true);

    const result = await dispatch(
      changeSubChannelSettings({
        settings: {
          channelId: currentSubChatId!,
          add: toBoolean(add!),
          type: Number(type),
          roleId: assignRoleId!,
        },
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      setLoading(false);
      showSuccess('Настройки успешно изменены');
      onClose();
    }

    setLoading(false);
  };

  return (
    <Stack gap="md">
      <Text size="lg" w={500}>
        Смена настроек для ролей
      </Text>
      <Group align="center">
        <Select
          label="Действие"
          placeholder="Выберите действие"
          data={[
            { value: 'true', label: 'Разрешить' },
            { value: 'false', label: 'Запретить' },
          ]}
          value={add}
          onChange={setAdd}
          disabled={loading}
        />
        <Select
          label="Возможность"
          placeholder="Выберите возможность"
          data={[{ value: '4', label: 'Использовать' }]}
          value={type}
          onChange={setType}
          disabled={loading}
        />
        <Select
          label="Выбор роли"
          placeholder="Выберите роль"
          data={roles
            .filter((role) => role.roleType !== RoleType.Creator)
            .map((role) => ({
              value: role.roleId,
              label: role.roleName,
            }))}
          value={assignRoleId}
          onChange={setAssignRoleId}
          disabled={loading}
        />
      </Group>
      <Button
        onClick={handleChangeChannelSettings}
        disabled={loading}
        loading={loading}
      >
        Изменить настройки
      </Button>
    </Stack>
  );
};
