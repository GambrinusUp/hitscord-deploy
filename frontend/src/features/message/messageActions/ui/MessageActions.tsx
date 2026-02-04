import { Menu } from '@mantine/core';
import { Edit2, Trash2 } from 'lucide-react';

import { MessageType } from '~/entities/message';
import { useAppSelector } from '~/hooks';
import { useWebSocket } from '~/shared/lib/websocket';

interface MessageActionsProps {
  messageId: number;
  type: MessageType;
  setIsEditing: (value: boolean) => void;
  setEditedContent: (value: React.SetStateAction<string>) => void;
  messageContent: string;
  isOwnMessage: boolean;
}

export const MessageActions = ({
  messageId,
  type,
  setIsEditing,
  setEditedContent,
  messageContent,
  isOwnMessage,
}: MessageActionsProps) => {
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { currentChannelId, currentNotificationChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const { currentSubChatId } = useAppSelector((state) => state.subChatStore);
  const { deleteMessage, deleteChatMessage } = useWebSocket();

  const activeChannelId = currentChannelId ?? currentNotificationChannelId;

  const handleDelete = () => {
    switch (type) {
      case MessageType.CHANNEL:
        deleteMessage({
          Token: accessToken,
          ChannelId: activeChannelId!,
          MessageId: messageId,
        });
        break;
      case MessageType.CHAT:
        deleteChatMessage({
          Token: accessToken,
          ChannelId: activeChat!,
          MessageId: messageId,
        });
        break;
      case MessageType.SUBCHAT:
        deleteMessage({
          Token: accessToken,
          ChannelId: currentSubChatId!,
          MessageId: messageId,
        });
        break;
    }
  };

  const handleEdit = () => {
    setEditedContent(messageContent);
    setIsEditing(true);
  };

  return (
    <>
      {isOwnMessage && (
        <Menu.Item leftSection={<Edit2 size={12} />} onClick={handleEdit}>
          Редактировать
        </Menu.Item>
      )}
      <Menu.Item leftSection={<Trash2 size={12} />} onClick={handleDelete}>
        Удалить
      </Menu.Item>
    </>
  );
};
