import { ActionIcon, Group, Textarea } from '@mantine/core';
import { Paperclip, Send } from 'lucide-react';
import { useState } from 'react';

import { ChatMessage } from '~/entities/chat';
import { clearFiles, attachFile } from '~/entities/files';
import { MessageType } from '~/entities/message';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { LoadingState } from '~/shared';
import { useFileUploadNotification } from '~/shared/lib/hooks/useFileUploadNotification';
import { useWebSocket } from '~/shared/lib/websocket';
import { ChannelMessage, ServerMessageType } from '~/store/ServerStore';

interface SendMessageFormProps {
  CreatePoll: React.ComponentType<{ type: MessageType }>;
  setReplyMessage: React.Dispatch<
    React.SetStateAction<ChannelMessage | ChatMessage | null>
  >;
  replyMessage: ChannelMessage | ChatMessage | null;
}

export const SendMessageForm = ({
  CreatePoll,
  replyMessage,
  setReplyMessage,
}: SendMessageFormProps) => {
  const { sendChatMessage } = useWebSocket();
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { chat } = useAppSelector((state) => state.chatsStore);
  const { uploadedFiles, loading } = useAppSelector(
    (state) => state.filesStore,
  );

  useFileUploadNotification(loading === LoadingState.PENDING);

  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() && chat.chatId && ((message.trim()).length > 0 || uploadedFiles.length > 0)) {
      sendChatMessage({
        Token: accessToken,
        ChannelId: chat.chatId,
        Classic: {
          Text: message.trim(),
          Files: uploadedFiles.map((file) => file.fileId),
          NestedChannel: false,
        },
        ReplyToMessageId: replyMessage ? replyMessage.id : undefined,
        MessageType: ServerMessageType.Classic,
      });
      setMessage('');
      setReplyMessage(null);
      dispatch(clearFiles());
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !chat?.chatId) return;

    for (const file of Array.from(e.target.files)) {
      await dispatch(attachFile({ channelId: chat.chatId, file })).unwrap();
    }

    e.target.value = '';
  };

  const disabled = (message.trim()).length > 0 || uploadedFiles.length > 0;

  return (
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
        placeholder="Написать..."
        value={message}
        onChange={(event) => setMessage(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        autosize
        minRows={1}
        maxRows={3}
      />
      <ActionIcon size="xl" variant="transparent" disabled={!disabled} onClick={handleSendMessage}>
        <Send size={20} />
      </ActionIcon>
    </Group>
  );
};
