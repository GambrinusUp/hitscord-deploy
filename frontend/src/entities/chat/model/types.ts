import { FileResponse } from '~/entities/files';
import { SystemRole } from '~/entities/presets';
import { LoadingState } from '~/shared/types';
import { NestedChannel } from '~/store/ServerStore';

export interface Chat {
  chatId: string;
  chatName: string;
  nonReadedCount: number;
  nonReadedTaggedCount: number;
  lastReadedMessageId: number;
  icon: FileResponse | null;
}

export interface GetChats {
  chatsList: Chat[];
}

export interface UserInChat {
  chatId: string;
  userId: string;
  userName: string;
  userTag: string;
  icon: FileResponse | null;
  notifiable: boolean;
  friendshipApplication: boolean;
  nonFriendMessage: boolean;
  isFriend: boolean;
  systemRoles: Omit<SystemRole, 'id' | 'childRoles'>[];
}

export interface ChatInfo {
  chatId: string;
  chatName: string;
  users: UserInChat[];
  nonReadedCount: number;
  nonReadedTaggedCount: number;
  lastReadedMessageId: number;
  nonNotifiable: boolean;
  icon: FileResponse | null;
}

export enum MessageType {
  Classic = 'Classic',
  Vote = 'Vote',
}

export interface MessageFile {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

/* Вынести в shared */
export interface ReplyMessage {
  messageType: MessageType;
  serverId: string | null;
  channelId: string;
  id: number;
  authorId: string;
  createdAt: string;
  text: string;
}

export interface VoteVariant {
  id: string;
  number: number;
  content: string;
  totalVotes: number;
  votedUserIds: string[];
}

export interface ChatMessage {
  messageType: MessageType;
  serverId: string | null;
  serverName: string | null;
  channelId: string;
  channelName: string | null;
  id: number;
  authorId: string;
  createdAt: string;
  replyToMessage: ReplyMessage | null;
  isTagged?: boolean;

  text?: string | null;
  modifiedAt?: string | null;
  nestedChannel?: NestedChannel | null;
  files?: MessageFile[] | null;

  title?: string | null;
  content?: string | null;
  isAnonimous?: boolean;
  multiple?: boolean;
  deadline?: string | null;
  variants?: VoteVariant[];
  totalUsers?: number;
}

export interface ChatsState {
  chatsList: Chat[];
  chatsLoading: LoadingState;
  chat: ChatInfo;
  activeChat: string | null;
  chatLoading: LoadingState;
  messages: ChatMessage[];
  messagesStatus: LoadingState;
  messageIsLoading: LoadingState;
  remainingTopMessagesCount: number;
  lastTopMessageId: number;
  remainingBottomMessagesCount: number;
  lastBottomMessageId: number;
  startMessageId: number;
  allMessagesCount: number;
  error: string;
}

export interface GetChatMessages {
  messages: ChatMessage[];
  numberOfMessages: number;
  startMessageId: number;
  remainingMessagesCount: number;
  allMessagesCount: number;
}

export interface GetMessagesParams {
  chatId: string;
  number: number;
  fromMessageId: number;
  down: boolean;
}
