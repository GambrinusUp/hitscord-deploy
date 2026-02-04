const BASE_PATH = '/files';

export const GET_FILE = (channelId: string, fileId: string) =>
  `${BASE_PATH}/item?channelId=${channelId}&FileId=${fileId}`;
export const GET_ICON = (fileId: string) =>
  `${BASE_PATH}/icon?fileId=${fileId}`;
export const ATTACH_FILE = `${BASE_PATH}/message`;
export const REMOVE_FILE = `${BASE_PATH}/remove`;
