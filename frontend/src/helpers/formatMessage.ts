import { ChatMessage, MessageFile } from '~/entities/chat';
import {
  MessageType,
  VoteVariant,
  ReplyMessage,
  ChannelMessage,
  NestedChannel,
} from '~/store/ServerStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatMessageFile = (rawFile: any): MessageFile => ({
  fileId: rawFile.FileId, // FileId -> fileId
  fileName: rawFile.FileName, // FileName -> fileName
  fileType: rawFile.FileType, // FileType -> fileType
  fileSize: rawFile.FileSize, // FileSize -> fileSize
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatReplyMessage = (rawMessage: any): ReplyMessage => ({
  messageType: MessageType.Classic,
  serverId: rawMessage.ServerId || null,
  channelId: rawMessage.ChannelId,
  id: rawMessage.Id,
  authorId: rawMessage.AuthorId,
  createdAt: rawMessage.CreatedAt,
  text: rawMessage.Text,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatVoteVariant = (rawVariant: any): VoteVariant => ({
  id: rawVariant.Id,
  number: rawVariant.Number,
  content: rawVariant.Content,
  totalVotes: rawVariant.TotalVotes,
  votedUserIds: rawVariant.VotedUserIds, // Предполагается массив строк/чисел
});
/*
 "SubChannelId": "8d7c458e-f063-442b-b129-60c160ccad9b",
            "CanUse": true,
            "IsNotifiable": true
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatNestedChannel = (rawNestedChannel: any): NestedChannel => ({
  subChannelId: rawNestedChannel.SubChannelId,
  canUse: rawNestedChannel.CanUse,
  isNotifiable: rawNestedChannel.IsNotifiable,
});

export const formatMessage = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawMessage: any,
): ChatMessage | ChannelMessage => {
  const messageType = rawMessage.MessageType;

  const baseMessage = {
    messageType: messageType,
    serverId: rawMessage.ServerId || null,
    serverName: rawMessage.ServerName || null,
    channelId: rawMessage.ChannelId,
    channelName: rawMessage.ChannelName || null,
    id: rawMessage.Id,
    authorId: rawMessage.AuthorId,
    createdAt: rawMessage.CreatedAt,
    replyToMessage: rawMessage.ReplyToMessage
      ? formatReplyMessage(rawMessage.ReplyToMessage)
      : null,
    isTagged: rawMessage.isTagged,
  };

  if (messageType === MessageType.Classic) {
    return {
      ...baseMessage,
      text: rawMessage.Text || null,
      modifiedAt: rawMessage.ModifiedAt || null,
      nestedChannel: rawMessage.NestedChannel
        ? formatNestedChannel(rawMessage.NestedChannel)
        : null,
      files: rawMessage.Files ? rawMessage.Files.map(formatMessageFile) : null,
    };
  } else if (messageType === MessageType.Vote) {
    return {
      ...baseMessage,
      title: rawMessage.Title || null,
      content: rawMessage.Content || null,
      isAnonimous: rawMessage.IsAnonimous || false,
      multiple: rawMessage.Multiple || false,
      deadline: rawMessage.Deadline || null,
      variants: rawMessage.Variants
        ? rawMessage.Variants.map(formatVoteVariant)
        : [],
      totalUsers: rawMessage.TotalUsers,
    };
  }

  return {
    ...baseMessage,
    text: rawMessage.Text || null,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatChatMessage = (rawMessage: any): ChatMessage => {
  const messageType = rawMessage.MessageType;

  const baseMessage = {
    messageType: messageType,
    serverId: rawMessage.ServerId || null,
    serverName: rawMessage.ServerName || null,
    channelId: rawMessage.ChannelId,
    channelName: rawMessage.ChannelName || null,
    id: rawMessage.Id,
    authorId: rawMessage.AuthorId,
    createdAt: rawMessage.CreatedAt,
    replyToMessage: rawMessage.ReplyToMessage
      ? formatReplyMessage(rawMessage.ReplyToMessage)
      : null,
    isTagged: rawMessage.isTagged,
  };

  if (messageType === MessageType.Classic) {
    return {
      ...baseMessage,
      text: rawMessage.Text || null,
      modifiedAt: rawMessage.ModifiedAt || null,
      nestedChannel: rawMessage.NestedChannel
        ? formatNestedChannel(rawMessage.NestedChannel)
        : null,
      files: rawMessage.Files ? rawMessage.Files.map(formatMessageFile) : null,
    };
  } else if (messageType === MessageType.Vote) {
    return {
      ...baseMessage,
      title: rawMessage.Title || null,
      content: rawMessage.Content || null,
      isAnonimous: rawMessage.IsAnonimous || false,
      multiple: rawMessage.Multiple || false,
      deadline: rawMessage.Deadline || null,
      variants: rawMessage.Variants
        ? rawMessage.Variants.map(formatVoteVariant)
        : [],
      totalUsers: rawMessage.TotalUsers,
    };
  }

  return {
    ...baseMessage,
    text: rawMessage.Text || null,
  };
};
