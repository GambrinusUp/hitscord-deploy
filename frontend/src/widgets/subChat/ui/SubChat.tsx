import {
  ActionIcon,
  Box,
  Group,
  Modal,
  Notification,
  ScrollArea,
  Text,
  Textarea,
} from '@mantine/core';
import { ArrowDown, Paperclip, Send } from 'lucide-react';
import { useRef, useState } from 'react';

import { ChatMessage } from '~/entities/chat';
import { attachFile, clearFiles } from '~/entities/files';
import { MessageType, useMessageAuthor } from '~/entities/message';
import { setCurrentSubChatId, setSubChatInfo } from '~/entities/subChat';
import { AttachedFilesList } from '~/features/attachedFilesList';
import { CreatePoll } from '~/features/polls';
import { EditSettings } from '~/features/subChat';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { formatTagMessage } from '~/modules/ChatSection/ChatSection.utils';
import { LoadingState } from '~/shared';
import { useScrollToBottom, useScrollToMessage } from '~/shared/lib/hooks';
import { useFileUploadNotification } from '~/shared/lib/hooks/useFileUploadNotification';
import { useWebSocket } from '~/shared/lib/websocket';
import { ChannelMessage, ServerMessageType } from '~/store/ServerStore';

interface SubChatProps {
  opened: boolean;
  MessagesList: React.ComponentType<{
    scrollRef: React.RefObject<HTMLDivElement>;
    type: MessageType;
    replyToMessage: (message: ChatMessage | ChannelMessage) => void;
    onEditMessage?: (message: ChatMessage | ChannelMessage) => void;
    onScrollToReplyMessage?: (replyMessageId: number) => void;
  }>;
}

export const SubChat = ({ opened, MessagesList }: SubChatProps) => {
  const dispatch = useAppDispatch();
  const { sendMessage, editMessage } = useWebSocket();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { currentSubChatId, messagesStatus, messages } = useAppSelector(
    (state) => state.subChatStore,
  );
  const { uploadedFiles, loading } = useAppSelector(
    (state) => state.filesStore,
  );

  useFileUploadNotification(loading === LoadingState.PENDING);

  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<{
    id: number;
    originalText: string;
  } | null>(null);
  const [replyMessage, setReplyMessage] = useState<
    ChatMessage | ChannelMessage | null
  >(null);

  const { getUsername } = useMessageAuthor(MessageType.SUBCHAT);
  const {
    scrollRef,
    isAtBottom,
    showButton,
    handleScroll,
    scrollToBottom,
    buttonOffset,
  } = useScrollToBottom({
    messagesStatus,
    dependencies: [messages],
    type: 'channel',
    hasReplyMessage: !!replyMessage,
    hasAttachedFiles: uploadedFiles.length > 0,
  });
  const { scrollToMessage } = useScrollToMessage({
    scrollRef,
    type: MessageType.SUBCHAT,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = (nestedChannel: boolean) => {
    const trimmedText = newMessage.trim();

    if (editingMessage && currentSubChatId && trimmedText.length > 0) {
      if (trimmedText === editingMessage.originalText.trim()) return;

      editMessage({
        Token: accessToken,
        ChannelId: currentSubChatId,
        MessageId: editingMessage.id,
        Text: formatTagMessage(trimmedText),
      });
      setNewMessage('');
      setEditingMessage(null);

      return;
    }

    if (
      currentSubChatId &&
      (trimmedText.length > 0 || uploadedFiles.length > 0)
    ) {
      sendMessage({
        Token: accessToken,
        ChannelId: currentSubChatId,
        Classic: {
          Text: formatTagMessage(trimmedText),
          NestedChannel: nestedChannel,
          Files: uploadedFiles.map((file) => file.fileId),
        },
        ReplyToMessageId: replyMessage ? replyMessage.id : undefined,
        MessageType: ServerMessageType.Classic,
      });
      setNewMessage('');
      setReplyMessage(null);
      dispatch(clearFiles());
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !currentSubChatId) return;

    for (const file of Array.from(e.target.files)) {
      await dispatch(
        attachFile({ channelId: currentSubChatId, file }),
      ).unwrap();
    }

    e.target.value = '';
  };

  const handleClose = () => {
    dispatch(setCurrentSubChatId(null));
    dispatch(setSubChatInfo(null));
  };

  const handleStartEdit = (messageToEdit: ChatMessage | ChannelMessage) => {
    const textToEdit = messageToEdit.text ?? '';
    setReplyMessage(null);
    setEditingMessage({ id: messageToEdit.id, originalText: textToEdit });
    setNewMessage(textToEdit);
    dispatch(clearFiles());
    textareaRef.current?.focus();
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setNewMessage('');
  };

  const disabled = editingMessage
    ? newMessage.trim().length > 0 &&
      newMessage.trim() !== editingMessage.originalText.trim()
    : newMessage.trim().length > 0 || uploadedFiles.length > 0;

  return (
    <Modal.Root
      opened={opened}
      onClose={handleClose}
      centered
      size="75%"
      styles={{
        content: { backgroundColor: '#2c2e33', color: '#ffffff' },
        header: { backgroundColor: '#2c2e33' },
      }}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Подчат</Modal.Title>
          <Group gap="xs">
            <EditSettings />
            <Modal.CloseButton />
          </Group>
        </Modal.Header>
        <Modal.Body>
          <Box
            style={{
              flex: 1,
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#2C2E33',
              height: '80vh',
            }}
          >
            <Box
              style={{
                flex: 1,
                position: 'relative',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <ScrollArea
                viewportRef={scrollRef}
                style={{ flex: 1, padding: 10 }}
                onScrollPositionChange={handleScroll}
                p="md"
              >
                <MessagesList
                  scrollRef={scrollRef}
                  type={MessageType.SUBCHAT}
                  replyToMessage={(message) => setReplyMessage(message)}
                  onEditMessage={handleStartEdit}
                  onScrollToReplyMessage={scrollToMessage}
                />
              </ScrollArea>

              {!isAtBottom && showButton && (
                <Box
                  style={{
                    position: 'absolute',
                    bottom: buttonOffset,
                    right: 10,
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
            </Box>

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
              {editingMessage && (
                <Box p={6}>
                  <Notification
                    title="Редактирование сообщения"
                    onClose={handleCancelEdit}
                  >
                    <Text lineClamp={2}>{editingMessage.originalText}</Text>
                  </Notification>
                </Box>
              )}
              <Group mt="auto" align="center" wrap="nowrap" gap={0}>
                <ActionIcon
                  component="label"
                  size="xl"
                  variant="transparent"
                  disabled={
                    loading === LoadingState.PENDING || !!editingMessage
                  }
                >
                  <Paperclip size={20} />
                  <input
                    type="file"
                    hidden
                    multiple
                    disabled={!!editingMessage}
                    onChange={handleFileChange}
                  />
                </ActionIcon>
                <CreatePoll
                  type={MessageType.SUBCHAT}
                  disabled={!!editingMessage}
                />
                <Textarea
                  ref={textareaRef}
                  w="100%"
                  placeholder="Написать..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autosize
                  minRows={1}
                  maxRows={3}
                />
                <ActionIcon
                  size="xl"
                  variant="transparent"
                  disabled={!disabled}
                  onClick={() => handleSendMessage(false)}
                >
                  <Send size={20} />
                </ActionIcon>
              </Group>
            </Box>
          </Box>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
