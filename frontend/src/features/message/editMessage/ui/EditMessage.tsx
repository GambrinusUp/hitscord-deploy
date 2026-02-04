import { ActionIcon, Group, Stack, Textarea } from '@mantine/core';
import { Check, X } from 'lucide-react';

import { editMessageStyles } from './EditMessage.style';

import { MessageType } from '~/entities/message';
import { useAppSelector } from '~/hooks';
import { useWebSocket } from '~/shared/lib/websocket';

interface EditMessageProps {
  editedContent: string;
  setEditedContent: (value: React.SetStateAction<string>) => void;
  setIsEditing: (value: boolean) => void;
  messageId: number;
  type: MessageType;
}

export const EditMessage = ({
  editedContent,
  setEditedContent,
  setIsEditing,
  messageId,
  type,
}: EditMessageProps) => {
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { currentChannelId, currentNotificationChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const { currentSubChatId } = useAppSelector((state) => state.subChatStore);
  const { editMessage, editChatMessage } = useWebSocket();

  const activeChannelId = currentChannelId ?? currentNotificationChannelId;

  const handleEdit = () => {
    if (!editedContent.trim()) {
      return;
    }

    switch (type) {
      case MessageType.CHANNEL:
        editMessage({
          Token: accessToken,
          ChannelId: activeChannelId!,
          MessageId: messageId,
          Text: editedContent.trim(),
        });
        break;
      case MessageType.CHAT:
        editChatMessage({
          Token: accessToken,
          ChannelId: activeChat!,
          MessageId: messageId,
          Text: editedContent.trim(),
        });
        break;
      case MessageType.SUBCHAT:
        editMessage({
          Token: accessToken,
          ChannelId: currentSubChatId!,
          MessageId: messageId,
          Text: editedContent.trim(),
        });
        break;
    }

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleChangeMessage = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setEditedContent(event.currentTarget.value);
  };

  return (
    <Stack gap="xs">
      <Textarea
        radius="md"
        value={editedContent}
        onChange={handleChangeMessage}
        autosize
        minRows={1}
        style={editMessageStyles.textarea()}
      />
      <Group gap="xs" justify="flex-end">
        <ActionIcon variant="filled" color="green" onClick={handleEdit}>
          <Check size={12} />
        </ActionIcon>
        <ActionIcon variant="filled" color="red" onClick={handleCancelEdit}>
          <X size={12} />
        </ActionIcon>
      </Group>
    </Stack>
  );
};
