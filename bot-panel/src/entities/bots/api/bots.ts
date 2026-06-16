import type {
  Bot,
  BotLog,
  BotWithApiKey,
  CreateBotRequest,
} from '~/entities/bots/model/types';

import { BOTS_PATH } from './const';

import { api } from '~/shared';

export const getBots = async (): Promise<Bot[]> => {
  const { data } = await api.get(BOTS_PATH);

  return Array.isArray(data) ? data : data.bots || data;
};

export const createBot = async (
  botData: CreateBotRequest,
): Promise<BotWithApiKey> => {
  const { data } = await api.post(BOTS_PATH, botData);

  return data;
};

export const getBotById = async (id: string): Promise<Bot> => {
  const { data } = await api.get(`${BOTS_PATH}/${id}`);

  return data;
};

export const deleteBot = async (id: string): Promise<void> => {
  await api.delete(`${BOTS_PATH}/${id}`);
};

export const regenerateBotToken = async (id: string): Promise<string> => {
  const { data } = await api.post(`${BOTS_PATH}/${id}/token/regenerate`);

  return typeof data === 'string' ? data : data.botApiKey;
};

export const revokeBotTokens = async (id: string): Promise<void> => {
  await api.delete(`${BOTS_PATH}/${id}/tokens`);
};

export const getBotLogs = async (
  id: string,
  serverId: string,
  limit: number = 100,
): Promise<BotLog[]> => {
  const { data } = await api.get(`${BOTS_PATH}/${id}/logs`, {
    params: { serverId, limit },
  });

  return data;
};

export const clearBotLogs = async (
  id: string,
  serverId: string,
): Promise<void> => {
  await api.delete(`${BOTS_PATH}/${id}/logs`, {
    params: { serverId },
  });
};
