import { useAppSelector } from '~/hooks';

export const useChatData = () => {
  const messages = useAppSelector((state) => state.chatsStore.messages);
  const messagesStatus = useAppSelector(
    (state) => state.chatsStore.messagesStatus,
  );
  const remainingTopMessagesCount = useAppSelector(
    (state) => state.chatsStore.remainingTopMessagesCount,
  );
  const lastTopMessageId = useAppSelector(
    (state) => state.chatsStore.lastTopMessageId,
  );
  const remainingBottomMessagesCount = useAppSelector(
    (state) => state.chatsStore.remainingBottomMessagesCount,
  );
  const lastBottomMessageId = useAppSelector(
    (state) => state.chatsStore.lastBottomMessageId,
  );
  const startMessageId = useAppSelector(
    (state) => state.chatsStore.startMessageId,
  );
  const allMessagesCount = useAppSelector(
    (state) => state.chatsStore.allMessagesCount,
  );
  const entityId = useAppSelector((state) => state.chatsStore.activeChat);
  const lastReadedMessageId = useAppSelector(
    (state) => state.chatsStore.chat.lastReadedMessageId,
  );

  return {
    messages,
    messagesStatus,
    remainingTopMessagesCount,
    lastTopMessageId,
    remainingBottomMessagesCount,
    lastBottomMessageId,
    startMessageId,
    allMessagesCount,
    entityId,
    lastReadedMessageId,
  };
};
