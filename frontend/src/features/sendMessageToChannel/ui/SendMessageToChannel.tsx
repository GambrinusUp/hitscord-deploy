import { ActionIcon, Group, Textarea } from '@mantine/core';
import { MessageSquarePlus, Paperclip, Send } from 'lucide-react';
import { useState } from 'react';

import { clearFiles, attachFile } from '~/entities/files';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { LoadingState } from '~/shared';
import { useWebSocket } from '~/shared/lib/websocket';
import { ServerMessageType } from '~/store/ServerStore';

export const SendMessageToChannel = () => {
  const { sendChatMessage } = useWebSocket();
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { chat } = useAppSelector((state) => state.chatsStore);
  const { uploadedFiles, loading } = useAppSelector(
    (state) => state.filesStore,
  );

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
        MessageType: ServerMessageType.Classic,
      });
      setMessage('');
      dispatch(clearFiles());
    }
  };

  const handleCreateSubchat = () => {
    if (message.trim() && chat.chatId && ((message.trim()).length > 0 || uploadedFiles.length > 0)) {
      sendChatMessage({
        Token: accessToken,
        ChannelId: chat.chatId,
        Classic: {
          Text: message.trim(),
          Files: uploadedFiles.map((file) => file.fileId),
          NestedChannel: true,
        },
        MessageType: ServerMessageType.Classic,
      });
      setMessage('');
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
      <ActionIcon size="xl" variant="transparent" disabled={!disabled} onClick={handleCreateSubchat}>
        <MessageSquarePlus size={20} />
      </ActionIcon>
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
