import { Modal, Pill, Stack } from '@mantine/core';

import { RolesPermissionsModalProps } from './RolesPermissionsModal.types';

import { SETTINGS_NAMES } from '~/constants';
import { useAppSelector } from '~/hooks';

export const RolesPermissionsModal = ({
  opened,
  onClose,
}: RolesPermissionsModalProps) => {
  const { permissions } = useAppSelector(
    (state) => state.testServerStore.serverData,
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Просмотр разрешений"
      size="auto"
    >
      <Stack gap="xs">
        {Object.entries(permissions)
          .filter(([_, value]) => value === true)
          .map(([key]) => (
            <Pill key={key} radius="sm">
              {SETTINGS_NAMES[key as keyof typeof SETTINGS_NAMES] || key}
            </Pill>
          ))}
      </Stack>
    </Modal>
  );
};
