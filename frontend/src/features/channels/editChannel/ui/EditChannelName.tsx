import { Button, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';

import { useAppDispatch, useNotification } from '~/hooks';
import { changeChannelName } from '~/store/ServerStore';

interface EditChannelNameProps {
  channelName: string;
  channelId: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

export const EditChannelName = ({
  channelName,
  channelId,
  loading,
  setLoading,
  onClose,
}: EditChannelNameProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const [newChannelName, setNewChannelName] = useState(channelName);

  const handleChangeChannelName = async () => {
    setLoading(true);
    const result = await dispatch(
      changeChannelName({
        id: channelId,
        name: newChannelName,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      setLoading(false);
      showSuccess('Название канала успешно изменилось');
      onClose();
    }
  };

  return (
    <Stack gap="md">
      <Text size="lg" w={500}>
        Изменить название канала
      </Text>
      <TextInput
        label="Новое название канала"
        value={newChannelName}
        onChange={(e) => setNewChannelName(e.target.value)}
        placeholder={channelName}
        disabled={loading}
      />
      <Button
        onClick={handleChangeChannelName}
        disabled={loading}
        loading={loading}
      >
        Изменить название
      </Button>
    </Stack>
  );
};
