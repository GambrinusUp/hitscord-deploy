import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

import { ChangeNameModalProps } from './ChangeNameModal.types';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { changeNameOnServer } from '~/store/ServerStore';

export const ChangeNameModal = ({ opened, onClose }: ChangeNameModalProps) => {
  const dispatch = useAppDispatch();
  const { currentServerId } = useAppSelector((state) => state.testServerStore);
  //const [newName, setNewName] = useState('');
  const { showSuccess } = useNotification();

  const form = useForm({
    initialValues: {
      newName: '',
    },

    validate: {
      newName: (value) => {
        const length = value.trim().length;

        if (length < 6) {
          return 'Имя должно содержать минимум 6 символов';
        }

        if (length > 50) {
          return 'Имя не должно превышать 50 символов';
        }

        return null;
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (currentServerId) {
      const result = await dispatch(
        changeNameOnServer({
          serverId: currentServerId,
          name: values.newName,
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Имя успешно изменено');
        form.setValues({ newName: '' });
        onClose();
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Изменение имени на сервере"
      centered
      c="#ffffff"
      styles={{
        header: {
          backgroundColor: '#1a1b1e',
        },
        content: {
          backgroundColor: '#1a1b1e',
        },
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="xs">
          <TextInput
            label="Новое имя"
            placeholder="Введите новое имя"
            description="от 6 до 50 символов"
            {...form.getInputProps('newName')}
            maxLength={50}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="filled" type="submit">
              Изменить
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
