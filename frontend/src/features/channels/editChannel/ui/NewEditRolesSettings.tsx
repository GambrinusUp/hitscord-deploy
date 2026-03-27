import { Card, Group, Stack, Switch, Text } from '@mantine/core';

import { getOptionsForChannelType } from '~/features/channels/editChannel/lib';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { RoleType } from '~/store/RolesStore';
import {
  changeNotificationChannelSettings,
  changeTextChannelSettings,
  changeVoiceChannelSettings,
  ChannelType,
  GetChannelSettings,
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
}: EditRolesSettingsProps) => {
  const dispatch = useAppDispatch();
  const { serverData, roleSettings } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { showSuccess } = useNotification();

  const roles = serverData.roles.filter(
    (role) => role.type !== RoleType.Creator,
  );
  const options = getOptionsForChannelType(channelType);

  const getRoleChecked = (
    roleId: string,
    key: keyof GetChannelSettings,
  ): boolean => {
    const settingValue = roleSettings[key];

    if (settingValue === null) {
      return true;
    }

    if (Array.isArray(settingValue)) {
      return settingValue.some((role) => role.id === roleId);
    }

    return false;
  };

  const handleChange = async (
    type: number,
    value: boolean,
    assignRoleId: string,
  ) => {
    setLoading(true);

    if (channelType === ChannelType.TEXT_CHANNEL) {
      const result = await dispatch(
        changeTextChannelSettings({
          settings: {
            channelId,
            add: value,
            type: type,
            roleId: assignRoleId,
          },
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setLoading(false);
        showSuccess('Настройки успешно изменены');
      }
    }

    if (channelType === ChannelType.VOICE_CHANNEL) {
      const result = await dispatch(
        changeVoiceChannelSettings({
          settings: {
            channelId,
            add: value,
            type: type,
            roleId: assignRoleId,
          },
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setLoading(false);
        showSuccess('Настройки успешно изменены');
      }
    }

    if (channelType === ChannelType.NOTIFICATION_CHANNEL) {
      const result = await dispatch(
        changeNotificationChannelSettings({
          settings: {
            channelId,
            add: value,
            type: type,
            roleId: assignRoleId,
          },
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setLoading(false);
        showSuccess('Настройки успешно изменены');
      }
    }

    setLoading(false);
  };

  return (
    <Stack gap="md">
      {roles.map((role) => (
        <Card
          key={role.id}
          p="md"
          radius="md"
          style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--border-primary-soft)',
          }}
        >
          <Stack gap="sm">
            <Group gap="xs">
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: role.color,
                }}
              />
              <Text fw={600}>{role.name}</Text>
            </Group>
            {options.map((option) => {
              const isChecked = getRoleChecked(
                role.id,
                option.key as keyof GetChannelSettings,
              );

              return (
                <Group key={option.value} justify="space-between">
                  <Text size="sm">{option.label}</Text>
                  <Switch
                    disabled={loading}
                    checked={isChecked}
                    onChange={(event) =>
                      handleChange(
                        option.value,
                        event.currentTarget.checked,
                        role.id,
                      )
                    }
                  />
                </Group>
              );
            })}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};
