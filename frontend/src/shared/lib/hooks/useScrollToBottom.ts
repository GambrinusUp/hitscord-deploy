import { useState, useCallback, useEffect, useRef } from 'react';

import { useChannelData } from './useChannelMessagesData';
import { useChatData } from './useChatData';

import { getMoreChatMessages } from '~/entities/chat';
import { useAppDispatch } from '~/hooks';
import { LoadingState } from '~/shared/types';
import { clearHasNewMessage, getMoreMessages } from '~/store/ServerStore';

interface UseScrollToBottomProps {
  messagesStatus: LoadingState;
  dependencies?: unknown[];
  type?: 'chat' | 'channel';
  hasReplyMessage?: boolean;
  hasAttachedFiles?: boolean;
}

export const useScrollToBottom = ({
  messagesStatus,
  dependencies = [],
  type = 'chat',
  hasAttachedFiles = false,
}: UseScrollToBottomProps) => {
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showButton, setShowButton] = useState(false);

  const chatData = useChatData();
  const channelData = useChannelData();

  const { lastBottomMessageId, remainingBottomMessagesCount, entityId } =
    type === 'chat' ? chatData : channelData;

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

    setIsAtBottom(atBottom);

    if (atBottom) {
      setShowButton(false);
    }
  }, [scrollRef]);

  const scrollToBottom = useCallback(
    async (behavior: ScrollBehavior = 'smooth') => {
      if (!scrollRef.current) return;

      if (remainingBottomMessagesCount > 0 && entityId) {
        const numberToLoad = remainingBottomMessagesCount + 1;

        if (type === 'channel') {
          await dispatch(
            getMoreMessages({
              channelId: entityId,
              number: numberToLoad,
              fromMessageId: lastBottomMessageId,
              down: true,
            }),
          );
        } else {
          await dispatch(
            getMoreChatMessages({
              chatId: entityId,
              number: numberToLoad,
              fromMessageId: lastBottomMessageId,
              down: true,
            }),
          );
        }
      }

      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });

      setShowButton(false);
    },
    [scrollRef],
  );

  useEffect(() => {
    if (!isAtBottom) {
      setShowButton(true);
    } else if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });

      if (type === 'channel') {
        dispatch(clearHasNewMessage());
      }
    }
  }, [...dependencies, isAtBottom, scrollToBottom]);

  useEffect(() => {
    if (messagesStatus === LoadingState.FULFILLED && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'instant',
      });
    }
  }, [messagesStatus]);

  const calculateButtonOffset = () => {
    let offset = 10;

    if (hasAttachedFiles) offset += 56;

    /*if (hasReplyMessage) offset += 60;*/

    return offset;
  };

  return {
    scrollRef,
    isAtBottom,
    showButton,
    handleScroll,
    scrollToBottom,
    buttonOffset: calculateButtonOffset(),
  };
};
