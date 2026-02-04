import {
  ActionIcon,
  Stack,
  Title,
  Divider,
  ScrollArea,
  Text,
  Box,
  Group,
  Notification,
  Textarea,
  Paper,
  Avatar,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ArrowLeft,
  ArrowDown,
  Bell,
  BellOff,
  Paperclip,
  Send,
} from 'lucide-react';
import { useRef, useState } from 'react';

import { ChatMessage, setActiveChat } from '~/entities/chat';
import { attachFile, clearFiles } from '~/entities/files';
import { MessageType, useMessageAuthor } from '~/entities/message';
import { AttachedFilesList } from '~/features/attachedFilesList';
import {
  AddUserToChat,
  ChangeChatName,
  ChangeNotificationSetting,
  LeaveChat,
} from '~/features/chat';
import { CreatePoll } from '~/features/polls';
import { UpdateIcon } from '~/features/settings/updateIcon';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { formatTagMessage, useMentionSuggestions } from '~/modules/ChatSection';
import { LoadingState } from '~/shared';
import { useScrollToBottom } from '~/shared/lib/hooks';
import { useFileUploadNotification } from '~/shared/lib/hooks/useFileUploadNotification';
import { useWebSocket } from '~/shared/lib/websocket';
import { ChannelMessage, ServerMessageType } from '~/store/ServerStore';

interface ChatSectionProps {
  MessagesList: React.ComponentType<{
    scrollRef: React.RefObject<HTMLDivElement>;
    type: MessageType;
    replyToMessage: (message: ChatMessage) => void;
  }>;
}

export const ChatSection = ({ MessagesList }: ChatSectionProps) => {
  const dispatch = useAppDispatch();
  const [opened, { open, close }] = useDisclosure(false);
  const { messages, chat, messagesStatus } = useAppSelector(
    (state) => state.chatsStore,
  );
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { uploadedFiles, loading } = useAppSelector(
    (state) => state.filesStore,
  );
  const { scrollRef, isAtBottom, showButton, handleScroll, scrollToBottom } =
    useScrollToBottom({ messagesStatus, dependencies: [messages] });
  const { getUsername } = useMessageAuthor(MessageType.CHAT);
  const [replyMessage, setReplyMessage] = useState<
    ChatMessage | ChannelMessage | null
  >(null);

  const isNotifiable = chat.nonNotifiable;

  const { sendChatMessage } = useWebSocket();

  useFileUploadNotification(loading === LoadingState.PENDING);

  const [message, setMessage] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    suggestions,
    suggestionsRef,
    clearSuggestions,
    handleTextChange,
    showSuggestions,
    downSuggestion,
    upSuggestion,
    enterSuggestion,
    cancelSuggestion,
    insertMention,
    selectedSuggestionIndex,
    setSelectedSuggestionIndex,
  } = useMentionSuggestions({
    users: chat.users,
    roles: undefined,
    textareaRef,
    newMessage: message,
    setNewMessage: setMessage,
  });

  const handleSendMessage = () => {
    if (message.trim() && chat.chatId && ((message.trim()).length > 0 || uploadedFiles.length > 0)) {
      sendChatMessage({
        Token: accessToken,
        ChannelId: chat.chatId,
        Classic: {
          Text: formatTagMessage(message.trim()),
          Files: uploadedFiles.map((file) => file.fileId),
          NestedChannel: false,
        },
        ReplyToMessageId: replyMessage ? replyMessage.id : undefined,
        MessageType: ServerMessageType.Classic,
      });
      setMessage('');
      setReplyMessage(null);
      clearSuggestions();
      dispatch(clearFiles());
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }

      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        downSuggestion();
        break;

      case 'ArrowUp':
        event.preventDefault();
        upSuggestion();
        break;

      case 'Tab':
      case 'Enter':
        event.preventDefault();
        enterSuggestion();
        break;

      case 'Escape':
        event.preventDefault();
        cancelSuggestion();
        break;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !chat?.chatId) return;

    for (const file of Array.from(e.target.files)) {
      await dispatch(attachFile({ channelId: chat.chatId, file })).unwrap();
    }

    e.target.value = '';
  };

  const handleBack = () => {
    dispatch(setActiveChat(null));
  };

  const disabled = (message.trim()).length > 0 || uploadedFiles.length > 0;

  return (
    <>
      <Box
        style={{
          flex: 1,
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#2C2E33',
        }}
      >
        <Group align="center" gap="xs" wrap="nowrap" justify="space-between">
          <Group align="center">
            <ActionIcon variant="subtle" aria-label="Back" onClick={handleBack}>
              <ArrowLeft size={20} />
            </ActionIcon>
            <Stack gap={0}>
              <Group>
                <Title order={4}>{chat.chatName}</Title>
                <ChangeChatName />
              </Group>
              <Text size="xs" c="dimmed">
                {chat.users.length} участников
              </Text>
            </Stack>
          </Group>
          <Group>
            <ActionIcon variant="subtle" aria-label="reply" onClick={open}>
              {isNotifiable ? (
                <Bell size={24} color="var(--mantine-color-teal-6)" />
              ) : (
                <BellOff size={24} color="var(--mantine-color-red-6)" />
              )}
            </ActionIcon>
            <UpdateIcon type={'chat'} />
            <AddUserToChat />
            <LeaveChat chatId={chat.chatId} />
          </Group>
        </Group>
        <Divider my="md" />
        <ScrollArea
          viewportRef={scrollRef}
          style={{ flex: 1, padding: 10 }}
          onScrollPositionChange={handleScroll}
        >
          <MessagesList
            scrollRef={scrollRef}
            type={MessageType.CHAT}
            replyToMessage={(message) => setReplyMessage(message)}
          />
        </ScrollArea>
        {!isAtBottom && showButton && (
          <Box
            style={{
              position: 'absolute',
              bottom: 60,
              right: 320,
              zIndex: 10,
            }}
          >
            <ActionIcon
              size="lg"
              variant="filled"
              onClick={() => scrollToBottom()}
            >
              <ArrowDown size={20} />
            </ActionIcon>
          </Box>
        )}
        <Box pos="relative">
          <AttachedFilesList />
          {replyMessage && (
            <Box p={6}>
              <Notification
                title={getUsername(replyMessage.authorId)}
                onClose={() => setReplyMessage(null)}
              >
                <Text lineClamp={2}>
                  {replyMessage.text || replyMessage.title}
                </Text>
              </Notification>
            </Box>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <Paper
              ref={suggestionsRef}
              shadow="md"
              p="xs"
              pos="absolute"
              bottom="100%"
              left={0}
              right={0}
              mb="xs"
              mah={200}
              bg="#43474f"
              style={{ overflow: 'auto', zIndex: 1000 }}
            >
              <Stack gap="xs">
                {suggestions.map((item, index) => (
                  <Group
                    key={item.id}
                    p="xs"
                    style={{
                      cursor: 'pointer',
                      borderRadius: '4px',
                      backgroundColor:
                        index === selectedSuggestionIndex
                          ? 'var(--mantine-color-blue-light)'
                          : 'transparent',
                    }}
                    onClick={() => insertMention(item)}
                    onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  >
                    <Avatar size="sm" color="blue">
                      {item.display.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Text size="sm" fw={500}>
                        {item.display}
                      </Text>
                      <Text size="xs" c="dimmed">
                        @{item.tag} • {item.type}
                      </Text>
                    </Box>
                  </Group>
                ))}
              </Stack>
            </Paper>
          )}
          <Group mt="auto" align="center" wrap="nowrap" gap={0}>
            <ActionIcon
              component="label"
              size="xl"
              variant="transparent"
              disabled={loading === LoadingState.PENDING}
            >
              <Paperclip size={20} />
              <input type="file" hidden multiple onChange={handleFileChange} />
            </ActionIcon>
            <CreatePoll type={MessageType.CHAT} />
            <Textarea
              w="100%"
              ref={textareaRef}
              placeholder="Написать..."
              value={message}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              autosize
              minRows={1}
              maxRows={3}
            />
            <ActionIcon
              size="xl"
              variant="transparent"
              disabled={!disabled}
              onClick={handleSendMessage}
            >
              <Send size={20} />
            </ActionIcon>
          </Group>
        </Box>
      </Box>
      <ChangeNotificationSetting opened={opened} onClose={close} />
    </>
  );
};
