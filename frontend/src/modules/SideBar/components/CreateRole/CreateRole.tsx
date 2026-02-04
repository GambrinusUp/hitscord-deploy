import { Button, ColorInput, Modal, Stack, TextInput } from '@mantine/core';
import { Save } from 'lucide-react';
import { useState } from 'react';

import { CreateRoleProps } from './CreateRole.types';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { createRole } from '~/store/RolesStore';

export const CreateRole = ({ opened, onClose }: CreateRoleProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { currentServerId } = useAppSelector((state) => state.testServerStore);
  const [roleName, setRoleName] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [colorError, setColorError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateColor = (value: string): boolean => {
    const colorRegex = /^#([A-Fa-f0-9]{6})$/;

    return colorRegex.test(value);
  };

  const handleCreateRole = async () => {
    if (!validateColor(color)) {
      setColorError('Цвет должен быть в формате #000000');

      return;
    }

    setColorError('');

    if (
      roleName.trim().length > 1 &&
      color.trim().length > 1 &&
      currentServerId
    ) {
      setLoading(true);

      const result = await dispatch(
        createRole({
          role: { serverId: currentServerId, name: roleName.trim(), color },
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Роль успешно создана');
        setRoleName('');
        setColor('#ffffff');
        setColorError('');
        onClose();
      }
    }

    setLoading(false);
  };

  const isButtonDisabled =
    loading || roleName.trim().length < 1 || !validateColor(color);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Создание роли"
      size="auto"
    >
      <Stack>
        <TextInput
          label="Название роли"
          placeholder="Введите название роли"
          value={roleName}
          onChange={(event) => setRoleName(event.currentTarget.value)}
        />
        <ColorInput
          withEyeDropper={false}
          label="Выберите цвет"
          placeholder="#000000"
          value={color}
          onChange={(value) => {
            setColor(value);

            if (validateColor(value)) {
              setColorError('');
            }
          }}
          error={colorError}
        />
        <Button
          leftSection={<Save />}
          variant="light"
          radius="md"
          onClick={handleCreateRole}
          disabled={isButtonDisabled}
        >
          Создать
        </Button>
      </Stack>
    </Modal>
  );
};
