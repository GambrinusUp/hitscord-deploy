export interface MessageReaction {
  id: string;
  authorId: string;
  createdAt: string;
  reactionCode: string;
}

export interface AddReaction {
  ChannelId: string;
  MessageId: number;
  ReactionCode: string;
  Token: string;
}

export interface RemoveReaction {
  ChannelId: string;
  ReactionId: string;
  Token: string;
}

export interface ChatMessageReactionFull {
  id: string;
  chatId: string;
  messageId: number;
  authorId: string;
  createdAt: string;
  reactionCode: string;
}

export interface ChannelMessageReactionFull {
  id: string;
  serverId: string;
  channelId: string;
  messageId: number;
  authorId: string;
  createdAt: string;
  reactionCode: string;
}
