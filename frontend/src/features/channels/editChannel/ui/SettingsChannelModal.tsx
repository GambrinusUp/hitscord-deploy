import { Modal, Stack, ScrollArea, Group, NavLink } from '@mantine/core';
import {
  Bell,
  Pencil,
  Trash2,
  UserRoundCog,
  UserRoundPen,
  UsersRound,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { ChangeNotificationSetting } from './ChangeNotificationSetting';
import { ChannelRoles } from './ChannelRoles';
import { DeleteChannel } from './DeleteChannel';
import { EditChannelName } from './EditChannelName';
import { EditChannelUserCount } from './EditChannelUserCount';
import { EditRolesSettings } from './EditRolesSettings';

import { useAppDispatch, useAppSelector } from '~/hooks';
import { ChannelType, getChannelSettings } from '~/store/ServerStore';

interface SettingsChannelModalProps {
  opened: boolean;
  onClose: () => void;
  channelId: string;
  channelName: string;
  channelType: ChannelType;
}

export const SettingsChannelModal = ({
  opened,
  onClose,
  channelId,
  channelName,
  channelType,
}: SettingsChannelModalProps) => {
  const dispatch = useAppDispatch();
  const { serverData, error } = useAppSelector(
    (state) => state.testServerStore,
  );
  const canWorkChannels = serverData.permissions.canWorkChannels;

  const [activeSetting, setActiveSetting] = useState<
    'name' | 'delete' | 'watchSettings' | 'settings' | 'count' | 'notifiable'
  >(canWorkChannels ? 'name' : 'notifiable');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (canWorkChannels && opened) {
      dispatch(getChannelSettings({ channelId }));
    }
  }, [canWorkChannels, opened]);

  useEffect(() => {
    if (error !== '') {
      setLoading(false);
    }
  }, [error]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Настройки канала"
      size="auto"
      styles={{
        content: { backgroundColor: '#2c2e33', color: '#ffffff' },
        header: { backgroundColor: '#2c2e33' },
      }}
    >
      <Group align="flex-start" gap="md">
        <Stack gap="xs" style={{ width: 200 }}>
          <NavLink
            label="Уведомления"
            leftSection={<Bell size={16} />}
            active={activeSetting === 'notifiable'}
            onClick={() => setActiveSetting('notifiable')}
          />
          {canWorkChannels && (
            <NavLink
              label="Название"
              leftSection={<Pencil size={16} />}
              active={activeSetting === 'name'}
              onClick={() => setActiveSetting('name')}
            />
          )}
          {canWorkChannels && (
            <NavLink
              label="Удаление"
              leftSection={<Trash2 size={16} />}
              active={activeSetting === 'delete'}
              onClick={() => setActiveSetting('delete')}
            />
          )}
          {canWorkChannels && (
            <NavLink
              label="Роли"
              leftSection={<UserRoundCog size={16} />}
              active={activeSetting === 'watchSettings'}
              onClick={() => setActiveSetting('watchSettings')}
            />
          )}
          {canWorkChannels && (
            <NavLink
              label="Настройки"
              leftSection={<UserRoundPen size={16} />}
              active={activeSetting === 'settings'}
              onClick={() => setActiveSetting('settings')}
            />
          )}
          {canWorkChannels && channelType === ChannelType.VOICE_CHANNEL && (
            <NavLink
              label="Настройка числа пользователей"
              leftSection={<UsersRound size={16} />}
              active={activeSetting === 'count'}
              onClick={() => setActiveSetting('count')}
            />
          )}
        </Stack>
        <ScrollArea>
          {activeSetting === 'notifiable' && (
            <ChangeNotificationSetting channelId={channelId} />
          )}
          {activeSetting === 'name' && (
            <EditChannelName
              channelName={channelName}
              channelId={channelId}
              loading={loading}
              setLoading={setLoading}
              onClose={onClose}
            />
          )}
          {activeSetting === 'delete' && (
            <DeleteChannel
              channelId={channelId}
              loading={loading}
              setLoading={setLoading}
              onClose={onClose}
            />
          )}
          {activeSetting === 'watchSettings' && (
            <ChannelRoles channelType={channelType} />
          )}
          {activeSetting === 'settings' && (
            <EditRolesSettings
              channelId={channelId}
              channelType={channelType}
              loading={loading}
              setLoading={setLoading}
              onClose={onClose}
            />
          )}
          {activeSetting === 'count' && (
            <EditChannelUserCount
              channelId={channelId}
              loading={loading}
              setLoading={setLoading}
              onClose={onClose}
            />
          )}
        </ScrollArea>
      </Group>
    </Modal>
  );
};
