import {
  CREATE_PRESET,
  DELETE_PRESET,
  GET_PRESET_LIST,
  GET_SYSTEM_ROLES,
} from './const';

import {
  GetPresets,
  GetSystemRoles,
  Preset,
} from '~/entities/presets/model/types';
import { api } from '~/shared/api';

export const getPresets = async (serverId: string): Promise<GetPresets> => {
  const { data } = await api.get(GET_PRESET_LIST(serverId));

  return data;
};

export const getSystemRoles = async (
  serverId: string,
): Promise<GetSystemRoles> => {
  const { data } = await api.get(GET_SYSTEM_ROLES(serverId));

  return data;
};

export const createPreset = async (
  serverId: string,
  serverRoleId: string,
  systemRoleId: string,
): Promise<Preset> => {
  const { data } = await api.post(CREATE_PRESET, {
    serverId,
    serverRoleId,
    systemRoleId,
  });

  return data;
};

export const deletePreset = async (
  serverId: string,
  serverRoleId: string,
  systemRoleId: string,
): Promise<void> => {
  await api.delete(DELETE_PRESET, {
    data: {
      serverId,
      serverRoleId,
      systemRoleId,
    },
  });
};
