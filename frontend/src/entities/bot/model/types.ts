export interface Bot {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  permissions: string[];
  accountTag: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorServer {
  serverId: string;
  serverName: string;
  isNotifiable: boolean;
  icon: {
    fileId: string;
    fileName: string;
  } | null;
  nonReadedCount: number;
  nonReadedTaggedCount: number;
  serverType: number;
}

export interface CreatorServersResponse {
  serversList: CreatorServer[];
}

export interface SetBotToServerPayload {
  botId: string;
  serverId: string;
}
