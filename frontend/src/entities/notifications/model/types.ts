import { ReplyMessage } from '~/entities/chat/model/types';
import { FileResponse } from '~/entities/files';
import { MessageType } from '~/store/ServerStore';

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
