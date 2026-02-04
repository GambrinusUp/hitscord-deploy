import { Button, Stack, Text } from '@mantine/core';

import { useAppDispatch, useNotification } from '~/hooks';
import { deleteChannel } from '~/store/ServerStore';

interface DeleteChannelProps {
  channelId: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

export const DeleteChannel = ({
  channelId,
  loading,
  setLoading,
  onClose,
}: DeleteChannelProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();

  const handleDeleteChannel = async () => {
    setLoading(true);
    const result = await dispatch(
      deleteChannel({
        channelId,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      setLoading(false);
      showSuccess('Канал успешно удалён');
      onClose();
    }
  };

  return (
    <Stack gap="md">
      <Text size="lg" w={500}>
        Удаление канала
      </Text>
      <Button color="red" onClick={handleDeleteChannel} loading={loading}>
        Удалить канал
      </Button>
    </Stack>
  );
};
