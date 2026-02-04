import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Group,
  Indicator,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  Notification,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ArrowDown,
  Menu,
  MessageSquarePlus,
  Paperclip,
  Send,
  Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { ChatSectionProps } from './ChatSection.types';
import { formatTagMessage } from './ChatSection.utils';
import { useChannelSettings } from './lib/useChannelSettings';
import { useMentionSuggestions } from './lib/useMentionSuggestions';

import { ChatMessage } from '~/entities/chat';
import { attachFile, clearFiles } from '~/entities/files';
import { MessageType } from '~/entities/message';
import { useMessageAuthor } from '~/entities/message/lib/useMessageAuthor';
import { AttachedFilesList } from '~/features/attachedFilesList';
import { CreatePoll } from '~/features/polls';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { LoadingState } from '~/shared';
import { useScrollToBottom } from '~/shared/lib/hooks';
import { useFileUploadNotification } from '~/shared/lib/hooks/useFileUploadNotification';
import { useWebSocket } from '~/shared/lib/websocket';
import { ChannelMessage, ServerMessageType } from '~/store/ServerStore';
import { MessagesList } from '~/widgets/messagesList';
import { SubChat } from '~/widgets/subChat';

export const ChatSection = ({
  openSidebar,
  openDetailsPanel,
}: ChatSectionProps) => {
  const dispatch = useAppDispatch();
  const { sendMessage } = useWebSocket();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const {
    currentServerId,
    currentChannelId,
    currentNotificationChannelId,
    messages,
    messagesStatus,
    serverData,
  } = useAppSelector((state) => state.testServerStore);
  const { uploadedFiles, loading } = useAppSelector(
    (state) => state.filesStore,
  );
  const { currentSubChatId } = useAppSelector((state) => state.subChatStore);
  const users = serverData.users;
  const roles = serverData.roles;
  const { getUsername } = useMessageAuthor(MessageType.CHANNEL);
  const { scrollRef, isAtBottom, showButton, handleScroll, scrollToBottom } =
    useScrollToBottom({
      messagesStatus,
      dependencies: [messages],
      type: 'channel',
    });
  const [opened, { open, close }] = useDisclosure(false);
  const { canWrite, canWriteSub, nonReadedCount, nonReadedTaggedCount } =
    useChannelSettings();
  useFileUploadNotification(loading === LoadingState.PENDING);

  const activeChannelId = currentChannelId ?? currentNotificationChannelId;

  const [newMessage, setNewMessage] = useState('');
  const [replyMessage, setReplyMessage] = useState<
    ChatMessage | ChannelMessage | null
  >(null);

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
    users,
    roles,
    textareaRef,
    newMessage,
    setNewMessage,
  });

  const disabled = (newMessage.trim()).length > 0 || uploadedFiles.length > 0;

  const handleSendMessage = (nestedChannel: boolean) => {
    if (currentServerId && activeChannelId && ((newMessage.trim()).length > 0 || uploadedFiles.length > 0)) {
      sendMessage({
        Token: accessToken,
        ChannelId: activeChannelId,
        Classic: {
          Text: formatTagMessage(newMessage.trim()),
          NestedChannel: nestedChannel,
          Files: uploadedFiles.map((file) => file.fileId),
        },
        ReplyToMessageId: replyMessage ? replyMessage.id : undefined,
        MessageType: ServerMessageType.Classic,
      });
      setNewMessage('');
      setReplyMessage(null);
      clearSuggestions();
      dispatch(clearFiles());
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage(false);
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
    if (!e.target.files || !currentChannelId) return;

    for (const file of Array.from(e.target.files)) {
      await dispatch(
        attachFile({ channelId: currentChannelId, file }),
      ).unwrap();
    }

    e.target.value = '';
  };

  useEffect(() => {
    if (currentSubChatId) {
      open();
    } else {
      if (opened) {
        close();
      }
    }
  }, [currentSubChatId]);

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
          <ActionIcon
            variant="transparent"
            onClick={openSidebar}
            hiddenFrom="sm"
          >
            <Menu size={20} />
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            onClick={openDetailsPanel}
            hiddenFrom="sm"
          >
            <Users size={20} />
          </ActionIcon>
        </Group>
        <Divider my="md" />
        <ScrollArea
          viewportRef={scrollRef}
          style={{ flex: 1, padding: 10 }}
          onScrollPositionChange={handleScroll}
        >
          <MessagesList
            scrollRef={scrollRef}
            type={MessageType.CHANNEL}
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
            <Indicator
              size={14}
              disabled={nonReadedCount! <= 0 && nonReadedTaggedCount! <= 0}
              color={nonReadedTaggedCount! > 0 ? 'red' : 'blue'}
              withBorder
            >
              <ActionIcon
                size="lg"
                variant="filled"
                onClick={() => scrollToBottom()}
              >
                <ArrowDown size={20} />
              </ActionIcon>
            </Indicator>
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
            {canWrite && (
              <ActionIcon
                component="label"
                size="xl"
                variant="transparent"
                disabled={loading === LoadingState.PENDING}
              >
                <Paperclip size={20} />
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileChange}
                />
              </ActionIcon>
            )}
            {canWrite && <CreatePoll type={MessageType.CHANNEL} />}
            {canWrite && canWriteSub && (
              <ActionIcon
                size="xl"
                variant="transparent"
                disabled={!disabled}
                onClick={() => handleSendMessage(true)}
              >
                <MessageSquarePlus size={20} />
              </ActionIcon>
            )}
            <Textarea
              ref={textareaRef}
              w="100%"
              placeholder="Написать..."
              value={newMessage}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              autosize
              disabled={!canWrite}
              minRows={1}
              maxRows={3}
            />
            {canWrite && (
              <ActionIcon
                size="xl"
                variant="transparent"
                disabled={!disabled}
                onClick={() => {handleSendMessage(false)}}
              >
                <Send size={20} />
              </ActionIcon>
            )}
          </Group>
        </Box>
      </Box>
      <SubChat opened={opened} MessagesList={MessagesList} />
    </>
  );
};
