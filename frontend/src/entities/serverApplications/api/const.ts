const BASE_PATH = '/server/application';

export const GET_USER_APPLICATIONS = (page: number, size: number) =>
  `${BASE_PATH}s/user?Page=${page}&Size=${size}`;
export const GET_SERVER_APPLICATIONS = (
  serverId: string,
  page: number,
  size: number,
) => `${BASE_PATH}s/server?ServerId=${serverId}&Page=${page}&Size=${size}`;
export const REMOVE_USER_APPLICATION = `${BASE_PATH}/remove/user`;
export const REMOVE_SERVER_APPLICATION = `${BASE_PATH}/remove/server`;
export const APPROVE_APPLICATION = `${BASE_PATH}/approve`;
