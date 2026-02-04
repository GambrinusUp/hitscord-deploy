import { Button, Group, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { BellRing, CircleCheck, CircleX } from 'lucide-react';

import { useAppDispatch, useAppSelector } from './redux';

import { socket } from '~/api';
import { setActiveChat } from '~/entities/chat';
import { formatMessage } from '~/entities/message';
import { NotificationData } from '~/entities/notifications';
import { setOpenHome, setUserStreamView } from '~/store/AppStore';
import { setCurrentChannelId, setCurrentServerId } from '~/store/ServerStore';

export const useNotification = () => {
  const dispatch = useAppDispatch();
  // Передавать user?
  const { user } = useAppSelector((state) => state.userStore);

  const handleOpenChannel = (
    serverId: string | null,
    channelId: string,
    activeChannelId: string | null,
    isChat: boolean = false,
  ) => {
    if (isChat) {
      if (activeChannelId !== channelId) {
        dispatch(setOpenHome(true));
        dispatch(setActiveChat(channelId));
      }

      return;
    }

    if (activeChannelId === channelId) {
      dispatch(setUserStreamView(false));
      dispatch(setOpenHome(false));

      return;
    }

    dispatch(setCurrentServerId(serverId!));
    dispatch(setCurrentChannelId(channelId));
    dispatch(setUserStreamView(false));
    dispatch(setOpenHome(false));
    socket.emit('setServer', {
      serverId,
      userName: user.name,
      userId: user.id,
    });
  };

  const showSuccess = (message: string) => {
    notifications.show({
      message,
      position: 'top-center',
      color: 'green',
      radius: 'md',
      autoClose: 2000,
      icon: <CircleCheck />,
    });
  };

  const showError = (message: string) => {
    notifications.show({
      title: 'Ошибка',
      message,
      position: 'top-center',
      color: 'red',
      radius: 'md',
      autoClose: 2000,
      icon: <CircleX />,
    });
  };

  const showMessage = (
    notification: NotificationData,
    closeTime: number,
    activeChannelId: string | null,
    isChat: boolean = false,
  ) => {
    notifications.show({
      title: (
        <Group gap="xs">
          <BellRing size={14} />
          <Text>{'Новое упоминание'}</Text>
        </Group>
      ),
      message: (
        <Stack gap={0}>
          <Group gap="xs">
            <Text fw={500}>{notification.serverName}</Text>
            <Text># {notification.channelName}</Text>
          </Group>
          <Text
            lineClamp={2}
            dangerouslySetInnerHTML={{
              __html: formatMessage(notification.text),
            }}
          />
          <Button
            variant="light"
            size="xs"
            radius="md"
            mt="xs"
            onClick={() =>
              handleOpenChannel(
                notification.serverId,
                notification.channelId,
                activeChannelId,
                isChat,
              )
            }
          >
            Перейти к сообщению
          </Button>
        </Stack>
      ),
      position: 'top-right',
      color: 'yellow',
      radius: 'md',
      autoClose: closeTime * 1000,
    });
  };

  return { showSuccess, showError, showMessage };
};
