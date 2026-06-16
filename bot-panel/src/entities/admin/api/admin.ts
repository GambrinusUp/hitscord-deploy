import type { Developer } from '~/entities/admin/model/types';

import { ADMIN_BOTS_PATH, ADMIN_DEVELOPERS_PATH } from './const';

import { api } from '~/shared';

export const getDevelopers = async (search = ''): Promise<Developer[]> => {
  const { data } = await api.get(ADMIN_DEVELOPERS_PATH, {
    params: search.trim() ? { search: search.trim() } : undefined,
  });

  return Array.isArray(data) ? data : data.developers || [];
};

export const getDeveloperById = async (developerId: string): Promise<Developer> => {
  const { data } = await api.get(`${ADMIN_DEVELOPERS_PATH}/${developerId}`);

  return data;
};

export const revokeAdminBotTokens = async (botId: string): Promise<void> => {
  await api.delete(`${ADMIN_BOTS_PATH}/${botId}/tokens`);
};
