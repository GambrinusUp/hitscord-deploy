const BASE_PATH = '/server/presets';

export const GET_PRESET_LIST = (serverId: string) =>
  `${BASE_PATH}/list?ServerId=${serverId}`;
export const GET_SYSTEM_ROLES = (serverId: string) =>
  `${BASE_PATH}/systemroles?ServerId=${serverId}`;
export const CREATE_PRESET = `${BASE_PATH}/create`;
export const DELETE_PRESET = `${BASE_PATH}/delete`;
