import { Group, Modal, NavLink, ScrollArea, Stack } from '@mantine/core';
import { Bell, UserRoundPen } from 'lucide-react';
import { useState } from 'react';

import { ChangeNotificationSetting } from './ChangeNotificationSetting';
import { EditRolesSettings } from './EditRolesSettings';

import { useAppSelector } from '~/hooks';

interface EditSettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

export const EditSettingsModal = ({
  opened,
  onClose,
}: EditSettingsModalProps) => {
  const { subChatInfo } = useAppSelector((state) => state.subChatStore);
  const [activeSetting, setActiveSetting] = useState<'notifiable' | 'settings'>(
    'notifiable',
  );

  const isOwner = subChatInfo?.isOwner;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Настройки подчата"
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
          {isOwner && (
            <NavLink
              label="Настройки"
              leftSection={<UserRoundPen size={16} />}
              active={activeSetting === 'settings'}
              onClick={() => setActiveSetting('settings')}
            />
          )}
        </Stack>
        <ScrollArea>
          {activeSetting === 'notifiable' && <ChangeNotificationSetting />}
          {activeSetting === 'settings' && isOwner && (
            <EditRolesSettings onClose={onClose} />
          )}
        </ScrollArea>
      </Group>
    </Modal>
  );
};
