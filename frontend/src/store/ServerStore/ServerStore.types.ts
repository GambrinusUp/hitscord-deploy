import { MessageFile } from '~/entities/chat';
import { FileResponse } from '~/entities/files';
import { SystemRole } from '~/entities/presets';
import { ServerTypeEnum } from '~/entities/servers';
import { LoadingState } from '~/shared';
import { RoleType } from '~/store/RolesStore';

export interface ServerState {
  serversList: ServerItem[];
  serverData: ServerData;
  currentServerId: string | null;
  currentChannelId: string | null;
  currentNotificationChannelId: string | null;
  currentVoiceChannelId: string | null;
  currentVoiceChannelName: string | null;
  currentVoiceChannelServerId: string | null;
  messages: ChannelMessage[];
  hasNewMessage: boolean;
  messagesStatus: LoadingState;
  roleSettings: GetChannelSettings;
  bannedUsers: BannedUser[];
  pageBannedUsers: number;
  totalPagesBannedUsers: number;
  isLoading: boolean;
  messageIsLoading: LoadingState;

  numberOfMessages: number;
  startMessageId: number;
  remainingTopMessagesCount: number;
  lastTopMessageId: number;
  remainingBottomMessagesCount: number;
  lastBottomMessageId: number;
  allMessagesCount: number;

  error: string;
}

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

export interface NestedChannel {
  subChannelId: string;
  canUse?: boolean;
  isNotifiable?: boolean;
  rolesCanUse?: string[];
}

export interface ChannelMessage {
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

export interface GetMessage {
  messages: ChannelMessage[];
  numberOfMessages: number;
  startMessageId: number;
  remainingMessagesCount: number;
  allMessagesCount: number;
}

export enum ChannelType {
  TEXT_CHANNEL = 0,
  VOICE_CHANNEL = 1,
  NOTIFICATION_CHANNEL = 2,
}

export interface Role {
  id: string;
  serverId: string;
  name: string;
  tag: string;
  color: string;
  type: RoleType;
}

export interface UserOnServer {
  serverId: string;
  userId: string;
  userName: string;
  userTag: string;
  icon: FileResponse | null;
  roles: UserRoleOnServer[];
  notifiable: boolean;
  friendshipApplication: boolean;
  nonFriendMessage: boolean;
  isFriend: boolean;
  systemRoles: Omit<SystemRole, 'id' | 'childRoles'>[];
}

export interface TextChannel {
  channelId: string;
  channelName: string;
  canWrite: boolean;
  canWriteSub: boolean;
  isNotifiable: boolean;
  nonReadedCount: number;
  nonReadedTaggedCount: number;
  lastReadedMessageId: number;
  rolesCanWrite: UserRoleOnServer[];
}

export enum MuteStatus {
  NotMuted,
  SelfMuted,
  Muted,
}

export interface UserInVoiceChannel {
  userId: string;
  muteStatus: MuteStatus;
}

export interface VoiceChannel {
  channelId: string;
  channelName: string;
  canJoin: boolean;
  users: UserInVoiceChannel[];
  maxCount: number;
}

export interface AnnouncementChannel {
  channelId: string;
  channelName: string;
  canWrite: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  annoucementRoles: any[];
}

export interface UserRoleOnServer {
  roleId: string;
  roleName: string;
  roleType: RoleType;
}

export interface NotificationChannel {
  channelId: string;
  channelName: string;
  canWrite: boolean;
  isNotificated: boolean;
  isNotifiable: boolean;
  nonReadedCount: number;
  nonReadedTaggedCount: number;
  lastReadedMessageId: number;
}

export interface ServerData {
  serverId: string;
  serverName: string;
  serverType: ServerTypeEnum;
  icon: FileResponse | null;
  isClosed: boolean;
  roles: Role[];
  userRoles: UserRoleOnServer[];
  isCreator: boolean;
  permissions: {
    canChangeRole: boolean;
    canWorkChannels: boolean;
    canDeleteUsers: boolean;
    canMuteOther: boolean;
    canDeleteOthersMessages: boolean;
    canIgnoreMaxCount: boolean;
    canCreateRoles: boolean;
    canUseInvitations: boolean;
  };
  isNotifiable: boolean;
  users: UserOnServer[];
  channels: {
    textChannels: TextChannel[];
    voiceChannels: VoiceChannel[];
    notificationChannels: NotificationChannel[];
  };
  invitationString: string | null;
}

export interface ServerItem {
  serverId: string;
  serverName: string;
  isNotifiable: boolean;
  icon: FileResponse | null;
  nonReadedCount: number;
  nonReadedTaggedCount: number;
}

export interface GetServersResponse {
  serversList: ServerItem[];
}

export enum MessageType {
  Classic = 'Classic',
  Vote = 'Vote',
}

export enum ServerMessageType {
  Classic = 0,
  Vote = 1,
}

export interface CreateMessageWs {
  Token: string;
  ChannelId: string;
  ReplyToMessageId?: number;
  MessageType: ServerMessageType;
  Classic?: {
    Text: string;
    NestedChannel: boolean;
    Files?: string[];
  };
  Vote?: {
    Title: string;
    Content?: string;
    IsAnonimous: boolean;
    Multiple: boolean;
    Deadline?: string;
    Variants: {
      Number: number;
      Content: string;
    }[];
  };
}

export interface EditMessageWs {
  Token: string;
  ChannelId: string;
  MessageId: number;
  Text: string;
}

export interface DeleteMessageWs {
  Token: string;
  ChannelId: string;
  MessageId: number;
}

export interface ChannelSettings {
  channelId: string;
  add: boolean;
  type: number;
  roleId: string;
}

export interface GetChannelSettings {
  canSee: Role[] | null;
  canJoin: Role[] | null;
  canWrite: Role[] | null;
  canWriteSub: Role[] | null;
  canUse: Role[] | null;
  notificated: Role[] | null;
}

export interface BannedUser {
  userId: string;
  userName: string;
  userTag: string;
  mail: string;
  banReason?: string;
  banTime: string;
}

export interface BannedUserResponse {
  bannedList: BannedUser[];
  page: number;
  size: number;
  total: number;
}

export interface ReadMessageWs {
  Token: string;
  isChannel: boolean;
  MessageId: number;
  ChannelId: string;
}

export interface ChangeReadedCount {
  serverId: string;
  channelId: string;
  readedMessageId: number;
  isTagged: boolean;
}

export interface ReadedMessageWs {
  readChannelId: string;
  readedMessageId: number;
  serverId: string | null;
  isTagged: boolean;
}
