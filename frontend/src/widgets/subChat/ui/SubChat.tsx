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
import { useScrollToBottom } from '~/shared/lib/hooks';
import { useFileUploadNotification } from '~/shared/lib/hooks/useFileUploadNotification';
import { useWebSocket } from '~/shared/lib/websocket';
import { ChannelMessage, ServerMessageType } from '~/store/ServerStore';

interface SubChatProps {
  opened: boolean;
  MessagesList: React.ComponentType<{
    scrollRef: React.RefObject<HTMLDivElement>;
    type: MessageType;
    replyToMessage: (message: ChannelMessage) => void;
  }>;
}

export const SubChat = ({ opened, MessagesList }: SubChatProps) => {
  const dispatch = useAppDispatch();
  const { sendMessage } = useWebSocket();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { currentSubChatId, messagesStatus, messages } = useAppSelector(
    (state) => state.subChatStore,
  );
  const { uploadedFiles, loading } = useAppSelector(
    (state) => state.filesStore,
  );

  useFileUploadNotification(loading === LoadingState.PENDING);

  const { getUsername } = useMessageAuthor(MessageType.SUBCHAT);
  const { scrollRef, isAtBottom, showButton, handleScroll, scrollToBottom } =
    useScrollToBottom({
      messagesStatus,
      dependencies: [messages],
      type: 'channel',
    });

  const [newMessage, setNewMessage] = useState('');
  const [replyMessage, setReplyMessage] = useState<
    ChatMessage | ChannelMessage | null
  >(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = (nestedChannel: boolean) => {
    if (
      newMessage.trim() &&
      currentSubChatId &&
      (newMessage.trim().length > 0 || uploadedFiles.length > 0)
    ) {
      sendMessage({
        Token: accessToken,
        ChannelId: currentSubChatId,
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

  const disabled = newMessage.trim().length > 0 || uploadedFiles.length > 0;

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
              <Group mt="auto" align="center" wrap="nowrap" gap={0}>
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
                <CreatePoll type={MessageType.SUBCHAT} />
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
