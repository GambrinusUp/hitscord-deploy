import { ReplyMessage } from '~/entities/chat/model/types';
import { FileResponse } from '~/entities/files';
import { MessageType } from '~/store/ServerStore';
import { LoadingState } from '~/shared';

export interface NotificationData {
  text: string;
  modifiedAt: string | null;
  nestedChannel: null;
  files: FileResponse[] | null;
  messageType: MessageType;
  serverId: string;
  serverName: string;
  channelId: string;
  channelName: string;
  id: number;
  authorId: string;
  createdAt: string;
  replyToMessage: ReplyMessage | null;
}

export interface NotificationItem {
  id: string;
  text: string;
  createdAt: string;
  isReaded: boolean;
  serverId: string | null;
  textChannelId: string | null;
  chatId: string | null;
}

export interface NotificationListResponse {
  notifications: NotificationItem[] | null;
  page: number;
  size: number;
  total: number;
}

export interface NotificationQueryParams {
  page: number;
  size: number;
}

export interface NotificationsState {
  items: NotificationItem[];
  page: number;
  size: number;
  total: number;
  loading: LoadingState;
  loadingMore: LoadingState;
  initialized: boolean;
  error: string;
}
