import type {
  Bot,
  CreatorServer,
  CreatorServersResponse,
  SetBotToServerPayload,
} from '~/entities/bot/model/types';

import {
  GET_AVAILABLE_BOTS,
  GET_CREATOR_SERVERS,
  REMOVE_BOT_FROM_SERVER,
  SET_BOT_TO_SERVER,
} from './const';

import { api, botApi } from '~/shared/api/base';

export const getAvailableBots = async (): Promise<Bot[]> => {
  const { data } = await botApi.get<Bot[]>(GET_AVAILABLE_BOTS);

  return data;
};

export const getCreatorServers = async (): Promise<CreatorServer[]> => {
  const { data } = await api.get<CreatorServersResponse>(GET_CREATOR_SERVERS);

  return data.serversList;
};

export const setBotToServer = async ({
  botId,
  serverId,
}: SetBotToServerPayload): Promise<void> => {
  await api.post(SET_BOT_TO_SERVER, {
    botId,
    serverId,
  });
};

export const removeBotFromServer = async ({
  botId,
  serverId,
}: SetBotToServerPayload): Promise<void> => {
  await api.delete(REMOVE_BOT_FROM_SERVER, {
    data: {
      botId,
      serverId,
    },
  });
};
