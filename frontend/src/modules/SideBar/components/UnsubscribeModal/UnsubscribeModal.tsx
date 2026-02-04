import { Button, Group, Modal, Select, Stack } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UnsubscribeModalProp } from './UnsubscribeModal.types';

import {
  useAppDispatch,
  useAppSelector,
  useDisconnect,
  useNotification,
} from '~/hooks';
import { setOpenHome, setUserStreamView } from '~/store/AppStore';
import {
  creatorUnsubscribeFromServer,
  getUserServers,
  setCurrentVoiceChannelId,
  clearServerData,
} from '~/store/ServerStore';

export const UnsubscribeModal = ({ opened, onClose }: UnsubscribeModalProp) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const disconnect = useDisconnect();
  const { showSuccess, showError } = useNotification();
  const { serverData, currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { accessToken, user } = useAppSelector((state) => state.userStore);
  const [userId, setUserId] = useState<string | null>('');

  const handleUnsubscribeCreator = async () => {
    if (!userId) {
      showError('Выберите нового создателя');

      return;
    }

    disconnect(accessToken, currentVoiceChannelId!);
    dispatch(setUserStreamView(false));
    dispatch(setCurrentVoiceChannelId(null));

    const result = await dispatch(
      creatorUnsubscribeFromServer({
        serverId: serverData.serverId,
        newCreatorId: userId,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Вы успешно отписались');
      dispatch(getUserServers());
      dispatch(setOpenHome(true));
      dispatch(clearServerData());
      setUserId('');
      navigate('/main');
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Отписка от сервера"
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
      <Stack gap="xs">
        <Select
          label="Выбор нового создателя"
          placeholder="Выберите пользователя"
          data={serverData.users
            .filter((userOnServer) => userOnServer.userId !== user.id)
            .map((userOnServer) => ({
              value: userOnServer.userId,
              label: userOnServer.userName,
            }))}
          value={userId}
          onChange={setUserId}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="filled" onClick={handleUnsubscribeCreator}>
            Отписаться
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
