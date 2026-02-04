import { formatMessageFile, formatReplyMessage } from './formatMessage';

import { NotificationData } from '~/entities/notifications';
import { MessageType } from '~/store/ServerStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatNotification = (rawNotification: any): NotificationData => ({
  text: rawNotification.Text,
  modifiedAt: rawNotification.ModifiedAt,
  nestedChannel: rawNotification.NestedChannel,
  files: rawNotification.Files
    ? rawNotification.Files.map(formatMessageFile)
    : null,
  messageType: MessageType.Classic,
  serverId: rawNotification.ServerId,
  serverName: rawNotification.ServerName,
  channelId: rawNotification.ChannelId,
  channelName: rawNotification.ChannelName,
  id: rawNotification.Id,
  authorId: rawNotification.AuthorId,
  createdAt: rawNotification.CreatedAt,
  replyToMessage: rawNotification.ReplyToMessage
    ? formatReplyMessage(rawNotification.ReplyToMessage)
    : null,
});
