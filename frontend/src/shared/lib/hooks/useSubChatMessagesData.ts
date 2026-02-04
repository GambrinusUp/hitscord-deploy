import { useAppSelector } from '~/hooks';

export const useSubChatData = () => {
  const messages = useAppSelector((state) => state.subChatStore.messages);
  const messagesStatus = useAppSelector(
    (state) => state.subChatStore.messageIsLoading,
  );
  const remainingTopMessagesCount = useAppSelector(
    (state) => state.subChatStore.remainingTopMessagesCount,
  );
  const lastTopMessageId = useAppSelector(
    (state) => state.subChatStore.lastTopMessageId,
  );
  const remainingBottomMessagesCount = useAppSelector(
    (state) => state.subChatStore.remainingBottomMessagesCount,
  );
  const lastBottomMessageId = useAppSelector(
    (state) => state.subChatStore.lastBottomMessageId,
  );
  const startMessageId = useAppSelector(
    (state) => state.subChatStore.startMessageId,
  );
  const allMessagesCount = useAppSelector(
    (state) => state.subChatStore.allMessagesCount,
  );
  const entityId = useAppSelector(
    (state) => state.subChatStore.currentSubChatId,
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
    lastReadedMessageId: 0,
  };
};
