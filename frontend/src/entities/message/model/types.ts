import { MessageFile } from '~/entities/chat';
import { MessageReaction } from '~/entities/reactions';
import { NestedChannel, ReplyMessage } from '~/store/ServerStore';

export enum MessageType {
  CHAT = 'CHAT',
  CHANNEL = 'CHANNEL',
  SUBCHAT = 'SUBCHAT',
}

export interface MessageItemProps {
  messageId: number;
  type: MessageType;
  isOwnMessage: boolean;
  content: string;
  replyMessage: ReplyMessage | null;
  time: string;
  authorId: string;
  channelId: string;
  isTagged: boolean | undefined;
  modifiedAt?: string | null;
  files: MessageFile[] | null | undefined;
  nestedChannel: NestedChannel | null | undefined;
  reactions: MessageReaction[];
  onReplyMessage: () => void;
  onEditMessage?: () => void;
  onReplyPreviewClick?: (replyMessageId: number) => void;
  MessageActions?: React.FC<{
    onEdit: () => void;
    isOwnMessage: boolean;
  }>;
}

export interface EmojiInfo {
  count: number;
  isAuthor: boolean;
  reactionId: string | null;
}
