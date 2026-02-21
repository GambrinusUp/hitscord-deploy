import { useEffect, useRef } from 'react';

import { MAX_MESSAGE_NUMBER } from '~/constants';
import {
  getChatInfo,
  getChatMessages,
  getMoreChatMessages,
  readChatMessageWs,
} from '~/entities/chat';
import { MessageType } from '~/entities/message';
import { getSubChatMessages } from '~/entities/subChat';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { LoadingState } from '~/shared';
import {
  useChannelData,
  useChatData,
  useSubChatData,
} from '~/shared/lib/hooks';
import { useWebSocket } from '~/shared/lib/websocket';
import { getMoreMessages, readMessageWs } from '~/store/ServerStore';

/* Добавить поддержку currentNotificationChannelId и поправить lastReadedMessageId у всех типов  */
export const useMessages = (
  scrollRef: React.RefObject<HTMLDivElement>,
  type: MessageType,
) => {
  const dispatch = useAppDispatch();
  const { readMessage } = useWebSocket();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const { chatLoading } = useAppSelector((state) => state.chatsStore);
  const { currentServerId } = useAppSelector((state) => state.testServerStore);
  /*const textChannels = useAppSelector(
    (state) => state.testServerStore.serverData.channels.textChannels,
  );
  const lastReadedMessageId =
    textChannels.find((channel) => channel.channelId === currentChannelId)
      ?.lastReadedMessageId || 0;*/

  const chatData = useChatData();
  const channelData = useChannelData();
  const subChatData = useSubChatData();

  const getData = () => {
    switch (type) {
      case MessageType.CHANNEL:
        return channelData;
      case MessageType.CHAT:
        return chatData;
      case MessageType.SUBCHAT:
        return subChatData;
      default:
        return channelData;
    }
  };

  const {
    messages,
    messagesStatus,
    startMessageId,
    lastTopMessageId,
    lastBottomMessageId,
    remainingBottomMessagesCount,
    remainingTopMessagesCount,
    entityId,
    lastReadedMessageId,
  } = getData();

  const firstMessageElementRef = useRef<HTMLDivElement | null>(null);
  const lastMessageElementRef = useRef<HTMLDivElement | null>(null);

  const isLoadingTop = useRef(false);
  const isLoadingBottom = useRef(false);
  const prevScrollHeightRef = useRef<number | null>(null);

  useEffect(() => {
    if (type === MessageType.CHAT && activeChat) {
      dispatch(getChatInfo({ chatId: activeChat }));
    }
  }, [activeChat, dispatch, type]);

  // Вызывается два раза/ много раз, возможно при смене active chat не сбрасывается chat.chatId
  useEffect(() => {
    if (!entityId) return;

    if (type === MessageType.CHAT && chatLoading === LoadingState.FULFILLED) {
      const isFirstLoad = startMessageId === 0;

      dispatch(
        getChatMessages({
          chatId: entityId,
          number: MAX_MESSAGE_NUMBER,
          fromMessageId: startMessageId,
          down: isFirstLoad,
        }),
      );
    }

    if (type === MessageType.SUBCHAT) {
      const isFirstLoad = startMessageId === 0;

      dispatch(
        getSubChatMessages({
          chatId: entityId,
          number: MAX_MESSAGE_NUMBER,
          fromMessageId: startMessageId,
          down: isFirstLoad,
        }),
      );
    }
  }, [entityId, startMessageId, type, dispatch, chatLoading]);

  useEffect(() => {
    if (!firstMessageElementRef.current) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;

        if (remainingTopMessagesCount < 1) return;

        if (isLoadingTop.current) return;

        isLoadingTop.current = true;

        const numberToLoad = Math.min(
          remainingTopMessagesCount,
          MAX_MESSAGE_NUMBER,
        );

        if (scrollRef.current) {
          prevScrollHeightRef.current = scrollRef.current.scrollHeight;
        }

        if (type === MessageType.CHANNEL && entityId) {
          await dispatch(
            getMoreMessages({
              channelId: entityId,
              number: numberToLoad + 1,
              fromMessageId: lastTopMessageId,
              down: false,
            }),
          );
        }

        if (type === MessageType.CHAT && entityId) {
          await dispatch(
            getMoreChatMessages({
              chatId: entityId,
              number: numberToLoad + 1,
              fromMessageId: lastTopMessageId,
              down: false,
            }),
          );
        }

        requestAnimationFrame(() => {
          if (!scrollRef.current || prevScrollHeightRef.current === null) {
            return;
          }

          const newScrollHeight = scrollRef.current.scrollHeight;
          const diff = newScrollHeight - prevScrollHeightRef.current;

          scrollRef.current.scrollTop = diff;
          prevScrollHeightRef.current = null;
          isLoadingTop.current = false;
        });
      },
      {
        root: scrollRef.current,
        threshold: 0.1,
      },
    );

    observer.observe(firstMessageElementRef.current);

    return () => observer.disconnect();
  }, [entityId, remainingTopMessagesCount, lastTopMessageId, type, dispatch]);

  useEffect(() => {
    if (!lastMessageElementRef.current) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;

        if (remainingBottomMessagesCount < 1) return;

        if (isLoadingBottom.current) return;

        const numberToLoad = Math.min(
          remainingBottomMessagesCount,
          MAX_MESSAGE_NUMBER,
        );
        isLoadingBottom.current = true;

        try {
          if (type === MessageType.CHAT && entityId) {
            await dispatch(
              getMoreChatMessages({
                chatId: entityId,
                number: numberToLoad + 1,
                fromMessageId: lastBottomMessageId,
                down: true,
              }),
            );
          }

          if (type === MessageType.CHANNEL && entityId) {
            await dispatch(
              getMoreMessages({
                channelId: entityId,
                number: numberToLoad + 1,
                fromMessageId: lastBottomMessageId,
                down: true,
              }),
            );
          }
        } finally {
          isLoadingBottom.current = false;
        }
      },
      {
        root: scrollRef.current,
        threshold: 0.1,
      },
    );

    observer.observe(lastMessageElementRef.current);

    return () => {
      isLoadingBottom.current = false;
      observer.disconnect();
    };
  }, [
    entityId,
    remainingBottomMessagesCount,
    lastBottomMessageId,
    type,
    dispatch,
  ]);

  useEffect(() => {
    if (!scrollRef.current || type === MessageType.SUBCHAT) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = Number(
              entry.target.getAttribute('data-message-id'),
            );
            const attributeValue = entry.target.getAttribute(
              'data-message-is-tagged',
            );
            const isTagged = attributeValue === 'true';

            const isChannel = type === MessageType.CHANNEL;
            const targetId = isChannel ? entityId : activeChat;

            if (!targetId) return;

            if (messageId > lastReadedMessageId) {
              //console.log('read message', messageId);

              readMessage({
                Token: accessToken,
                isChannel: isChannel,
                MessageId: messageId,
                ChannelId: targetId,
              });

              if (isChannel) {
                dispatch(
                  readMessageWs({
                    readChannelId: targetId,
                    readedMessageId: messageId,
                    serverId: currentServerId,
                    isTagged,
                  }),
                );
              } else {
                dispatch(
                  readChatMessageWs({
                    readChatId: targetId,
                    readedMessageId: messageId,
                    isTagged,
                  }),
                );
              }
            }
          }
        });
      },
      { threshold: 0.5, root: scrollRef.current },
    );

    messages.forEach((message) => {
      const element = document.querySelector(
        `[data-message-id="${message.id}"]`,
      );

      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [
    messages,
    lastReadedMessageId,
    type,
    accessToken,
    activeChat,
    currentServerId,
    entityId,
    dispatch,
    readMessage,
    scrollRef,
  ]);

  return {
    messages,
    messagesStatus,
    firstMessageElementRef,
    lastMessageElementRef,
  };
};
