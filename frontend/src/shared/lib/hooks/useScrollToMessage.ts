import { RefObject, useCallback, useEffect, useRef } from 'react';

import { MAX_MESSAGE_NUMBER } from '~/constants';
import { getMoreChatMessages } from '~/entities/chat';
import { MessageType } from '~/entities/message';
import { getMoreSubChatMessages } from '~/entities/subChat';
import { useAppDispatch } from '~/hooks';
import { useChannelData } from '~/shared/lib/hooks/useChannelMessagesData';
import { useChatData } from '~/shared/lib/hooks/useChatData';
import { useSubChatData } from '~/shared/lib/hooks/useSubChatMessagesData';
import { getMoreMessages } from '~/store/ServerStore';

interface UseScrollToMessageProps {
  scrollRef: RefObject<HTMLDivElement>;
  type: MessageType;
  highlightDurationMs?: number;
  maxAutoloadBatches?: number;
}

interface ScrollToMessageOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
}

export const useScrollToMessage = ({
  scrollRef,
  type,
  highlightDurationMs = 1500,
  maxAutoloadBatches = 20,
}: UseScrollToMessageProps) => {
  const dispatch = useAppDispatch();
  const highlightTimeoutRef = useRef<number | null>(null);

  const chatData = useChatData();
  const channelData = useChannelData();
  const subChatData = useSubChatData();

  const dataByType = {
    [MessageType.CHAT]: chatData,
    [MessageType.CHANNEL]: channelData,
    [MessageType.SUBCHAT]: subChatData,
  } as const;

  const {
    messages,
    entityId,
    remainingTopMessagesCount,
    remainingBottomMessagesCount,
    lastTopMessageId,
    lastBottomMessageId,
  } = dataByType[type];
  const navigationStateRef = useRef({
    messages,
    entityId,
    remainingTopMessagesCount,
    remainingBottomMessagesCount,
    lastTopMessageId,
    lastBottomMessageId,
  });

  useEffect(
    () => () => {
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    navigationStateRef.current = {
      messages,
      entityId,
      remainingTopMessagesCount,
      remainingBottomMessagesCount,
      lastTopMessageId,
      lastBottomMessageId,
    };
  }, [
    entityId,
    lastBottomMessageId,
    lastTopMessageId,
    messages,
    remainingBottomMessagesCount,
    remainingTopMessagesCount,
  ]);

  const highlightMessage = useCallback(
    (targetElement: HTMLElement) => {
      const initialBoxShadow = targetElement.style.boxShadow;
      const initialTransition = targetElement.style.transition;

      targetElement.style.transition = 'box-shadow 0.2s ease';
      targetElement.style.boxShadow = '0 0 0 2px var(--mantine-color-blue-5)';

      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }

      highlightTimeoutRef.current = window.setTimeout(() => {
        targetElement.style.boxShadow = initialBoxShadow;
        targetElement.style.transition = initialTransition;
      }, highlightDurationMs);
    },
    [highlightDurationMs],
  );

  const findMessageElement = useCallback(
    (messageId: number) =>
      scrollRef.current?.querySelector<HTMLElement>(
        `[data-message-id="${messageId}"]`,
      ) ?? null,
    [scrollRef],
  );

  const loadMore = useCallback(
    async (down: boolean) => {
      const currentState = navigationStateRef.current;

      if (!currentState.entityId) return false;

      const remainingCount = down
        ? currentState.remainingBottomMessagesCount
        : currentState.remainingTopMessagesCount;
      const fromMessageId = down
        ? currentState.lastBottomMessageId
        : currentState.lastTopMessageId;

      if (remainingCount < 1 || fromMessageId < 1) return false;

      const numberToLoad = Math.min(remainingCount, MAX_MESSAGE_NUMBER) + 1;

      if (type === MessageType.CHANNEL) {
        const result = await dispatch(
          getMoreMessages({
            channelId: currentState.entityId,
            number: numberToLoad,
            fromMessageId,
            down,
          }),
        );

        return result.meta.requestStatus !== 'rejected';
      }

      if (type === MessageType.CHAT) {
        const result = await dispatch(
          getMoreChatMessages({
            chatId: currentState.entityId,
            number: numberToLoad,
            fromMessageId,
            down,
          }),
        );

        return result.meta.requestStatus !== 'rejected';
      }

      const result = await dispatch(
        getMoreSubChatMessages({
          chatId: currentState.entityId,
          number: numberToLoad,
          fromMessageId,
          down,
        }),
      );

      return result.meta.requestStatus !== 'rejected';
    },
    [dispatch, type],
  );

  const waitForDomUpdate = useCallback(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      }),
    [],
  );

  const scrollToMessage = useCallback(
    async (
      messageId: number,
      options: ScrollToMessageOptions = {
        behavior: 'smooth',
        block: 'center',
      },
    ) => {
      if (!scrollRef.current) return false;

      const targetElement = findMessageElement(messageId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: options.behavior ?? 'smooth',
          block: options.block ?? 'center',
        });

        highlightMessage(targetElement);

        return true;
      }

      for (let i = 0; i < maxAutoloadBatches; i += 1) {
        const currentState = navigationStateRef.current;
        const minLoadedId = currentState.messages[0]?.id;
        const maxLoadedId =
          currentState.messages[currentState.messages.length - 1]?.id;

        const canLoadTop = currentState.remainingTopMessagesCount > 0;
        const canLoadBottom = currentState.remainingBottomMessagesCount > 0;

        let shouldLoadDown: boolean;

        if (
          minLoadedId !== undefined &&
          messageId < minLoadedId &&
          canLoadTop
        ) {
          shouldLoadDown = false;
        } else if (
          maxLoadedId !== undefined &&
          messageId > maxLoadedId &&
          canLoadBottom
        ) {
          shouldLoadDown = true;
        } else if (
          minLoadedId === undefined &&
          maxLoadedId === undefined &&
          (canLoadTop || canLoadBottom)
        ) {
          shouldLoadDown = !canLoadTop;
        } else {
          break;
        }

        const loaded = await loadMore(shouldLoadDown);

        if (!loaded) break;

        await waitForDomUpdate();

        const loadedTarget = findMessageElement(messageId);

        if (loadedTarget) {
          loadedTarget.scrollIntoView({
            behavior: options.behavior ?? 'smooth',
            block: options.block ?? 'center',
          });

          highlightMessage(loadedTarget);

          return true;
        }
      }

      return false;
    },
    [
      findMessageElement,
      highlightMessage,
      loadMore,
      maxAutoloadBatches,
      scrollRef,
      waitForDomUpdate,
    ],
  );

  return { scrollToMessage };
};
