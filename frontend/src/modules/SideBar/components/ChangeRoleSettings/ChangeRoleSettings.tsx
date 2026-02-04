import {
  Button,
  Modal,
  ScrollArea,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { ChangeRoleSettingsProps } from './ChangeRoleSettings.types';

import { SETTINGS_NAMES } from '~/constants';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import {
  setEditedRole,
  Setting,
  Settings,
  updateRoleSettings,
} from '~/store/RolesStore';

export const ChangeRoleSettings = ({
  opened,
  onClose,
}: ChangeRoleSettingsProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { currentServerId } = useAppSelector((state) => state.testServerStore);
  const { role } = useAppSelector((state) => state.rolesStore);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: 'uncontrolled',
  });

  const handleSave = async () => {
    if (currentServerId && role) {
      const values = form.getValues();
      //const updates = [];
      let isSettingsChange = false;

      setLoading(true);

      const settingsMap: Record<Setting, keyof Settings> = {
        [Setting.CanChangeRole]: 'canChangeRole',
        [Setting.CanWorkChannels]: 'canWorkChannels',
        [Setting.CanDeleteUsers]: 'canDeleteUsers',
        [Setting.CanMuteOther]: 'canMuteOther',
        [Setting.CanDeleteOthersMessages]: 'canDeleteOthersMessages',
        [Setting.CanIgnoreMaxCount]: 'canIgnoreMaxCount',
        [Setting.CanCreateRole]: 'canCreateRoles',
        [Setting.CanCreateLessons]: 'canCreateLessons',
        [Setting.CanCheckAttendance]: 'canCheckAttendance',
        [Setting.CanUseInvitations]: 'canUseInvitations',
      };

      for (const [setting, key] of Object.entries(settingsMap)) {
        const newValue = values[key];
        const oldValue = role.settings[key];

        if (newValue !== oldValue) {
          const result = await dispatch(
            updateRoleSettings({
              updatedRoleSettings: {
                serverId: currentServerId,
                roleId: role.role.id,
                setting: Number(setting),
                add: newValue,
              },
            }),
          );

          if (result.meta.requestStatus === 'fulfilled') {
            isSettingsChange = true;
          }
          /*updates.push(
            dispatch(
              updateRoleSettings({
                accessToken,
                updatedRoleSettings: {
                  serverId: currentServerId,
                  roleId: role.role.id,
                  setting: Number(setting),
                  add: newValue,
                },
              }),
            ),
          );*/
        }
      }

      //const results = await Promise.allSettled(updates);

      /*isSettingsChange = results.some(
        (res) =>
          res.status === 'fulfilled' &&
          res.value?.meta?.requestStatus === 'fulfilled',
      );*/

      if (isSettingsChange) {
        showSuccess('Настройки успешно изменены');
      }

      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(setEditedRole(null));
    onClose();
  };

  useEffect(() => {
    if (role) {
      form.setValues({ ...role.settings });
    }
  }, [role]);

  return (
    <Modal opened={opened} onClose={handleClose} centered size="auto">
      <Stack>
        <Title order={5}>Настройки роли</Title>
        <ScrollArea.Autosize maw="100%" mah={500}>
          <Stack>
            {role &&
              Object.entries(role.settings).map(([key]) => (
                <React.Fragment key={key}>
                  <Text>
                    {SETTINGS_NAMES[key as keyof typeof SETTINGS_NAMES] || key}
                  </Text>
                  <Switch
                    size="lg"
                    key={form.key(key)}
                    {...form.getInputProps(key, { type: 'checkbox' })}
                  />
                </React.Fragment>
              ))}
          </Stack>
        </ScrollArea.Autosize>
        <Button
          disabled={loading}
          loading={loading}
          leftSection={<Save />}
          variant="light"
          radius="md"
          onClick={handleSave}
        >
          Сохранить
        </Button>
      </Stack>
    </Modal>
  );
};
