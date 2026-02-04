import { LoadingState } from '~/shared';
import { ChannelMessage } from '~/store/ServerStore';

export interface SubChatState {
  currentSubChatId: string | null;
  subChatInfo: SubChatInfo | null;
  messages: ChannelMessage[];
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

export interface GetSubChatMessages {
  messages: ChannelMessage[];
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

export interface SubChatInfo {
  subChannelId: string;
  canUse: boolean;
  isNotifiable: boolean;
  isOwner: boolean;
}
