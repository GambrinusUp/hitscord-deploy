import { Button, Group, Modal, NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

import { getModalTitle } from '~/features/channels/createChannel/lib/getModalTitle';
import { useAppDispatch, useAppSelector } from '~/hooks';
import {
  combineValidators,
  maxLength,
  minLength,
} from '~/shared/lib/validators';
import { ChannelType, createChannel, getServerData } from '~/store/ServerStore';

interface CreateChannelModalProps {
  opened: boolean;
  onClose: () => void;
  channelType: ChannelType;
}

interface CreateChannelForm {
  name: string;
  count: number;
}

export const CreateChannelModal = ({
  opened,
  onClose,
  channelType,
}: CreateChannelModalProps) => {
  const dispatch = useAppDispatch();
  const { currentServerId } = useAppSelector((state) => state.testServerStore);

  const form = useForm<CreateChannelForm>({
    initialValues: {
      name: '',
      count: 3,
    },
    validate: {
      name: combineValidators(
        minLength(1, 'Название канала'),
        maxLength(100, 'Название канала'),
      ),
    },
  });

  const handleSubmit = async (values: CreateChannelForm) => {
    if (!currentServerId) {
      return;
    }

    const result = await dispatch(
      createChannel({
        serverId: currentServerId,
        name: values.name,
        channelType,
        maxCount:
          channelType === ChannelType.VOICE_CHANNEL ? values.count : undefined,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(getServerData({ serverId: currentServerId }));
    }

    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={getModalTitle(channelType)}
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
        <TextInput
          label="Название канала"
          placeholder="Введите название канала"
          {...form.getInputProps('name')}
        />
        {channelType === ChannelType.VOICE_CHANNEL && (
          <NumberInput
            label="Введите число"
            placeholder="Число от 3 до 999"
            {...form.getInputProps('count')}
            min={3}
            max={999}
          />
        )}
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit">Создать</Button>
        </Group>
      </form>
    </Modal>
  );
};
