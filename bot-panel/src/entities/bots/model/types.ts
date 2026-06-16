export const BotPermissionType = {
  MANAGE_ROLES: 'MANAGE_ROLES',
  MANAGE_CHANNELS: 'MANAGE_CHANNELS',
  SEND_MESSAGES: 'SEND_MESSAGES',
  READ_MESSAGES: 'READ_MESSAGES',
  ATTACH_FILES: 'ATTACH_FILES',
  JOIN_VOICE: 'JOIN_VOICE',
  RECORD_AUDIO: 'RECORD_AUDIO',
  STREAM_SCREEN: 'STREAM_SCREEN',
  MUTE_MEMBERS: 'MUTE_MEMBERS',
  KICK_MEMBERS: 'KICK_MEMBERS',
  CREATE_LESSON: 'CREATE_LESSON',
  CHECK_ATTENDANCE: 'CHECK_ATTENDANCE',
  NOTIFY_CHANNEL: 'NOTIFY_CHANNEL',
} as const;

export type BotPermissionType = (typeof BotPermissionType)[keyof typeof BotPermissionType];

export interface BotInstall {
  serverId: string;
  installedAt: string;
  enabled: boolean;
}

export interface Bot {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  permissions: string[];
  accountTag: string;
  verified: boolean;
  installs: BotInstall[];
  createdAt: string;
  updatedAt: string;
  activeTokensCount: number;
  revokedTokensCount: number;
  tokenRevoked: boolean;
}

export interface BotLog {
  id: string;
  botId: string;
  serverId: string;
  event: string;
  success: boolean;
  details: string;
  errorReason: string | null;
  timestamp: string;
}

export interface BotWithApiKey extends Bot {
  botApiKey: string;
}

export interface TokenRegenerateResponse {
  botApiKey: string;
}

export interface CreateBotRequest {
  name: string;
  description: string;
  mail: string;
  permissions: string[];
}

export interface BotsListResponse {
  bots: Bot[];
}
