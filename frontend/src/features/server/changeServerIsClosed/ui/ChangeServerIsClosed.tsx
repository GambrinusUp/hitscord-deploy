import { Button, Checkbox, Group, Stack, Text } from '@mantine/core';
import { Lock, LockOpen } from 'lucide-react';
import { useState } from 'react';

import { useNotification } from '~/hooks';
import { useAppDispatch, useAppSelector } from '~/hooks/redux';
import { changeServerIsClosed } from '~/store/ServerStore';

export const ChangeServerIsClosed = () => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { serverData, currentServerId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const [isApprove, setIsApprove] = useState(false);

  const isClosed = serverData.isClosed;

  const handleClose = async () => {
    const result = await dispatch(
      changeServerIsClosed({
        serverId: currentServerId!,
        isClosed: !isClosed,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Статус сервера успешно изменен');
    }
  };

  const handleOpen = async () => {
    const result = await dispatch(
      changeServerIsClosed({
        serverId: currentServerId!,
        isClosed: !isClosed,
        isApprove,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      setIsApprove(false);
      showSuccess('Статус сервера успешно изменен');
    }
  };

  return (
    <Stack gap="md">
      <Text size="lg" w={500}>
        Изменение закрытости сервера
      </Text>
      <Group gap="md">
        {isClosed ? (
          <>
            <Lock />
            <Text>Сервер сейчас закрыт</Text>
          </>
        ) : (
          <>
            <LockOpen />
            <Text>Сервер сейчас открыт</Text>
          </>
        )}
      </Group>
      {isClosed && (
        <Checkbox
          labelPosition="left"
          label="Принять заявки на вступление"
          checked={isApprove}
          onChange={(event) => setIsApprove(event.currentTarget.checked)}
        />
      )}
      {isClosed ? (
        <Button radius="md" variant="light" onClick={handleOpen}>
          Открыть сервер
        </Button>
      ) : (
        <Button radius="md" variant="light" onClick={handleClose}>
          Закрыть сервер
        </Button>
      )}
    </Stack>
  );
};
