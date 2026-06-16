import {
  ActionIcon,
  Box,
  Center,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { Check, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

import { socket } from '~/api';
import { setActiveChat } from '~/entities/chat';
import {
  deleteNotification,
  getNotifications,
  NotificationItem,
  readNotification,
} from '~/entities/notifications';
import { formatDateTime } from '~/helpers';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { LoadingState } from '~/shared';
import { setOpenHome, setUserStreamView } from '~/store/AppStore';
import { setCurrentChannelId, setCurrentServerId } from '~/store/ServerStore';

type Props = {
  onNavigate?: () => void;
};

const PAGE_SIZE = 20;

export const NotificationsPanelContent = ({ onNavigate }: Props) => {
  const dispatch = useAppDispatch();
  const viewportRef = useRef<HTMLDivElement>(null);
  const { items, page, total, initialized, loading, loadingMore } =
    useAppSelector((state) => state.notificationsStore);
  const { user } = useAppSelector((state) => state.userStore);
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const { currentChannelId } = useAppSelector((state) => state.testServerStore);

  useEffect(() => {
    if (!initialized && loading !== LoadingState.PENDING) {
      dispatch(getNotifications({ page: 1, size: PAGE_SIZE }));
    }
  }, [dispatch, initialized, loading]);

  const hasMore = useMemo(() => items.length < total, [items.length, total]);

  const loadMore = () => {
    if (
      loading === LoadingState.PENDING ||
      loadingMore === LoadingState.PENDING ||
      !hasMore
    ) {
      return;
    }

    dispatch(
      getNotifications({
        page: page + 1,
        size: PAGE_SIZE,
        append: true,
      }),
    );
  };

  const handleScroll = () => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const distanceToBottom =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;

    if (distanceToBottom < 120) {
      loadMore();
    }
  };

  const handleOpenNotification = async (notification: NotificationItem) => {
    if (!notification.isReaded) {
      await dispatch(readNotification({ id: notification.id }));
    }

    if (notification.chatId) {
      if (activeChat !== notification.chatId) {
        dispatch(setOpenHome(true));
        dispatch(setActiveChat(notification.chatId));
      }

      onNavigate?.();

      return;
    }

    if (notification.serverId && notification.textChannelId) {
      if (currentChannelId === notification.textChannelId) {
        dispatch(setUserStreamView(false));
        dispatch(setOpenHome(false));
        onNavigate?.();

        return;
      }

      dispatch(setCurrentServerId(notification.serverId));
      dispatch(setCurrentChannelId(notification.textChannelId));
      dispatch(setUserStreamView(false));
      dispatch(setOpenHome(false));
      socket.emit('setServer', {
        serverId: notification.serverId,
        userName: user.name,
        userId: user.id,
      });
    }

    onNavigate?.();
  };

  return (
    <ScrollArea
      h="100%"
      viewportRef={viewportRef}
      onScrollPositionChange={handleScroll}
      scrollbarSize={6}
    >
      <Stack gap={0}>
        {loading === LoadingState.PENDING && items.length === 0 ? (
          <Center py="xl">
            <Loader size="sm" color="yellow" />
          </Center>
        ) : null}

        {loading !== LoadingState.PENDING && items.length === 0 ? (
          <Center py="xl">
            <Text c="dimmed" size="sm">Уведомлений пока нет</Text>
          </Center>
        ) : null}

        {items.map((notification, index) => (
          <Box
            key={notification.id}
            style={{
              borderBottom:
                index === items.length - 1 ? 'none' : '1px solid #2C2E33',
              backgroundColor: notification.isReaded ? 'transparent' : '#222428',
            }}
          >
            <Group
              align="flex-start"
              gap="xs"
              wrap="nowrap"
              style={{ padding: '12px 10px' }}
            >
              <UnstyledButton
                onClick={() => handleOpenNotification(notification)}
                style={{ flex: 1, minWidth: 0, textAlign: 'left' }}
              >
                <Stack gap={6}>
                  <Group justify="space-between" gap="xs" wrap="nowrap">
                    <Text size="sm" fw={notification.isReaded ? 400 : 600}>
                      {notification.chatId
                        ? 'Личное сообщение'
                        : 'Уведомление'}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {formatDateTime(notification.createdAt)}
                    </Text>
                  </Group>
                  <Text
                    size="sm"
                    c={notification.isReaded ? 'gray.4' : 'white'}
                    lineClamp={3}
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                  >
                    {notification.text}
                  </Text>
                </Stack>
              </UnstyledButton>
              <Stack gap={6}>
                {!notification.isReaded && (
                  <Tooltip label="Отметить как прочитанное">
                    <ActionIcon
                      variant="subtle"
                      color="yellow"
                      onClick={() =>
                        dispatch(readNotification({ id: notification.id }))
                      }
                    >
                      <Check size={16} />
                    </ActionIcon>
                  </Tooltip>
                )}
                <Tooltip label="Удалить уведомление">
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() =>
                      dispatch(deleteNotification({ id: notification.id }))
                    }
                  >
                    <Trash2 size={16} />
                  </ActionIcon>
                </Tooltip>
              </Stack>
            </Group>
          </Box>
        ))}

        {loadingMore === LoadingState.PENDING ? (
          <Center py="sm">
            <Loader size="sm" color="yellow" />
          </Center>
        ) : null}
      </Stack>
    </ScrollArea>
  );
};
