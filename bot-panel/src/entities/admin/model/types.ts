export interface DeveloperStats {
  botsCount: number;
  installsCount: number;
  activeTokensCount: number;
  revokedTokensCount: number;
}

export interface AdminBotToken {
  id: string;
  createdAt: string;
  isActive: boolean;
  revoked: boolean;
  revokedAt: string | null;
  expiresAt: string;
  lastUsedAt: string | null;
}

export interface AdminBotInstall {
  id: string;
  serverId: string;
  serverName: string | null;
  installedBy: string;
  installedAt: string;
  enabled: boolean;
}

export interface AdminBotTokenStats {
  total: number;
  active: number;
  revoked: number;
}

export interface DeveloperBot {
  id: string;
  name: string;
  description: string;
  verified: boolean;
  permissions: string[];
  accountTag: string;
  createdAt: string;
  updatedAt: string;
  tokenStats: AdminBotTokenStats;
  tokens: AdminBotToken[];
  installs: AdminBotInstall[];
}

export interface Developer {
  id: string;
  email: string;
  name: string;
  role: 'developer';
  stats: DeveloperStats;
  bots: DeveloperBot[];
}

export interface RevokeAdminBotTokensPayload {
  botId: string;
  developerId?: string;
}
