import { Stack, Title, Button, ScrollArea, Group, Loader } from '@mantine/core';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';

import { ChatItem } from './ChatItem';

import { getChats } from '~/entities/chat';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { LoadingState } from '~/shared';

interface ChatsListProps {
  onCreateChatClick: () => void;
}

export const ChatsList = ({ onCreateChatClick }: ChatsListProps) => {
  const dispatch = useAppDispatch();
  const { chatsList, chatsLoading } = useAppSelector(
    (state) => state.chatsStore,
  );

  useEffect(() => {
    dispatch(getChats());
  }, []);

  return (
    <Stack w="100%" gap="md" p="md">
      <Group justify="space-between">
        <Title order={1}>Чаты</Title>
        <Button leftSection={<Plus />} onClick={onCreateChatClick}>
          Создать чат
        </Button>
      </Group>
      <ScrollArea style={{ flex: 1, maxHeight: '100%' }}>
        <Stack gap="xs" align="center">
          {chatsList.map((chat) => (
            <ChatItem key={chat.chatId} chat={chat} />
          ))}
          {chatsLoading === LoadingState.PENDING && <Loader />}
        </Stack>
      </ScrollArea>
    </Stack>
  );
};
