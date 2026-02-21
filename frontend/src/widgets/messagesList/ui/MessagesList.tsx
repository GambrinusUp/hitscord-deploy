import { Flex, Loader, Stack } from '@mantine/core';

import { ChatMessage } from '~/entities/chat';
import { MessageItem, MessageType } from '~/entities/message';
import { PollItem } from '~/entities/vote';
import { MessageActions } from '~/features/message';
import { useAppSelector } from '~/hooks';
import { LoadingState } from '~/shared';
import {
  ChannelMessage,
  MessageType as ServerMessageType,
} from '~/store/ServerStore';
import { useMessages } from '~/widgets/messagesList/lib/useMessages';

interface MessagesListProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  type: MessageType;
  replyToMessage: (message: ChatMessage | ChannelMessage) => void;
  onEditMessage?: (message: ChatMessage | ChannelMessage) => void;
  onScrollToReplyMessage?: (replyMessageId: number) => void;
}

export const MessagesList = ({
  scrollRef,
  type,
  replyToMessage,
  onEditMessage,
  onScrollToReplyMessage,
}: MessagesListProps) => {
  const { user } = useAppSelector((state) => state.userStore);

  const {
    messages,
    messagesStatus,
    firstMessageElementRef,
    lastMessageElementRef,
  } = useMessages(scrollRef, type);

  return (
    <Stack gap="sm">
      {messagesStatus === LoadingState.PENDING && (
        <Flex justify="center" align="center" w="100%">
          <Loader />
        </Flex>
      )}
      {messages.map((message, index) => {
        const isFirst = index === 0;
        const isLast = index === messages.length - 1;

        return (
          <div
            ref={(el) => {
              if (isFirst) firstMessageElementRef.current = el;

              if (isLast) lastMessageElementRef.current = el;
            }}
            key={message.id}
            data-message-id={message.id}
            data-message-is-tagged={message.isTagged}
          >
            {message.messageType === ServerMessageType.Classic ? (
              <MessageItem
                content={message.text!}
                replyMessage={message.replyToMessage}
                isOwnMessage={user.id === message.authorId}
                time={message.createdAt}
                modifiedAt={message.modifiedAt}
                authorId={message.authorId}
                channelId={message.channelId}
                isTagged={message.isTagged}
                files={message.files}
                nestedChannel={message.nestedChannel}
                MessageActions={(props) => (
                  <MessageActions
                    {...props}
                    type={type}
                    messageId={message.id}
                  />
                )}
                type={type}
                onReplyMessage={() => replyToMessage(message)}
                onEditMessage={() => onEditMessage?.(message)}
                onReplyPreviewClick={onScrollToReplyMessage}
              />
            ) : (
              <PollItem
                pollId={message.id}
                authorId={message.authorId}
                isOwnMessage={user.id === message.authorId}
                type={type}
                time={message.createdAt}
                title={message.title!}
                content={message.content}
                variants={message.variants!}
                multiple={message.multiple!}
                deadLine={message.deadline}
                isAnonimous={message.isAnonimous!}
                onReplyMessage={() => replyToMessage(message)}
                totalUsers={message.totalUsers!}
              />
            )}
          </div>
        );
      })}
    </Stack>
  );
};
