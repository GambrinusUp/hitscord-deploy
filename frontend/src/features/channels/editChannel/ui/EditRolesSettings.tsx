import { Button, Group, Select, Stack, Text } from '@mantine/core';
import { useState } from 'react';

import {
  getOptionsForChannelType,
  toBoolean,
} from '~/features/channels/editChannel/lib';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { RoleType } from '~/store/RolesStore';
import {
  changeNotificationChannelSettings,
  changeTextChannelSettings,
  changeVoiceChannelSettings,
  ChannelType,
} from '~/store/ServerStore';

interface EditRolesSettingsProps {
  channelId: string;
  channelType: ChannelType;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

export const EditRolesSettings = ({
  channelId,
  channelType,
  loading,
  setLoading,
  onClose,
}: EditRolesSettingsProps) => {
  const dispatch = useAppDispatch();
  const { serverData } = useAppSelector((state) => state.testServerStore);
  const { showSuccess } = useNotification();
  const [add, setAdd] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  const [assignRoleId, setAssignRoleId] = useState<string | null>('');

  const handleChangeChannelSettings = async () => {
    setLoading(true);

    if (
      channelType === ChannelType.TEXT_CHANNEL &&
      add &&
      type &&
      assignRoleId
    ) {
      const result = await dispatch(
        changeTextChannelSettings({
          settings: {
            channelId,
            add: toBoolean(add),
            type: Number(type),
            roleId: assignRoleId,
          },
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setLoading(false);
        showSuccess('Настройки успешно изменены');
        onClose();
      }
    }

    if (
      channelType === ChannelType.VOICE_CHANNEL &&
      add &&
      type &&
      assignRoleId
    ) {
      const result = await dispatch(
        changeVoiceChannelSettings({
          settings: {
            channelId,
            add: toBoolean(add),
            type: Number(type),
            roleId: assignRoleId,
          },
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setLoading(false);
        showSuccess('Настройки успешно изменены');
        onClose();
      }
    }

    if (
      channelType === ChannelType.NOTIFICATION_CHANNEL &&
      add &&
      type &&
      assignRoleId
    ) {
      const result = await dispatch(
        changeNotificationChannelSettings({
          settings: {
            channelId,
            add: toBoolean(add),
            type: Number(type),
            roleId: assignRoleId,
          },
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setLoading(false);
        showSuccess('Настройки успешно изменены');
        onClose();
      }
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
          data={getOptionsForChannelType(channelType)}
          value={type}
          onChange={setType}
          disabled={loading}
        />
        <Select
          label="Выбор роли"
          placeholder="Выберите роль"
          data={serverData.roles
            .filter((role) => role.type !== RoleType.Creator)
            .map((role) => ({
              value: role.id,
              label: role.name,
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
