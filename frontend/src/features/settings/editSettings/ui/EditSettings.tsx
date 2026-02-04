import { Button, Group } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Ban, Pencil, Save } from 'lucide-react';
import { useState } from 'react';

import {
  changeNotificationLifetime,
  changeSettings,
  changeUserProfile,
  SettingType,
  type SettingsForm,
} from '~/entities/user';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';

interface EditSettingsProps {
  isEdit: boolean;
  setIsEdit: (value: React.SetStateAction<boolean>) => void;
  form: UseFormReturnType<SettingsForm>;
}

export const EditSettings = ({
  isEdit,
  setIsEdit,
  form,
}: EditSettingsProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { user } = useAppSelector((state) => state.userStore);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
    form.setValues({
      ...{
        email: user.mail,
        name: user.name,
        notifiable: user.notifiable,
        friendshipApplication: user.friendshipApplication,
        nonFriendMessage: user.nonFriendMessage,
      },
    });
  };

  const handleSave = async () => {
    form.validate();

    if (!form.isValid()) return;

    const values = form.getValues();
    let isSettingsChange = false;

    setIsLoading(true);

    if (values.friendshipApplication !== user.friendshipApplication) {
      const result = await dispatch(
        changeSettings({ type: SettingType.FRIENDSHIP }),
      );

      isSettingsChange =
        result.meta.requestStatus === 'fulfilled' ? true : false;
    }

    if (values.nonFriendMessage !== user.nonFriendMessage) {
      const result = await dispatch(
        changeSettings({ type: SettingType.NONFRIEND }),
      );

      isSettingsChange =
        result.meta.requestStatus === 'fulfilled' ? true : false;
    }

    if (values.notifiable !== user.notifiable) {
      const result = await dispatch(
        changeSettings({ type: SettingType.NOTIFIABLE }),
      );

      isSettingsChange =
        result.meta.requestStatus === 'fulfilled' ? true : false;
    }

    if (isSettingsChange) {
      showSuccess('Настройки успешно изменены');
    }

    if (values.email !== user.mail || values.name !== user.name) {
      const result = await dispatch(
        changeUserProfile({
          newProfile: { name: values.name, mail: values.email },
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Профиль успешно изменен');
      }
    }

    if (values.notificationLifeTime !== user.notificationLifeTime) {
      const result = await dispatch(
        changeNotificationLifetime({
          time: values.notificationLifeTime,
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Профиль успешно изменен');
      }
    }

    setIsLoading(false);
    setIsEdit(false);
  };

  return (
    <Group justify="flex-end">
      {!isEdit ? (
        <Button
          leftSection={<Pencil />}
          radius="md"
          size="md"
          onClick={handleEdit}
        >
          Редактировать профиль
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            leftSection={<Ban />}
            radius="md"
            size="md"
            onClick={handleCancel}
            disabled={isLoading}
            loading={isLoading}
          >
            Отмена
          </Button>
          <Button
            leftSection={<Save />}
            radius="md"
            size="md"
            onClick={handleSave}
            disabled={isLoading}
            loading={isLoading}
          >
            Сохранить изменения
          </Button>
        </>
      )}
    </Group>
  );
};
