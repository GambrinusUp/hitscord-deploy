const BASE_PATH = '/friendship';

export const CREATE_APPLICATION = `${BASE_PATH}/application/create`;
export const GET_APPLICATION_FROM = `${BASE_PATH}/application/list/from`;
export const GET_APPLICATION_TO = `${BASE_PATH}/application/list/to`;
export const DELETE_APPLICATION = `${BASE_PATH}/application/delete`;
export const DECLINE_APPLICATION = `${BASE_PATH}/application/decline`;
export const APPROVE_APPLICATION = `${BASE_PATH}/application/approve`;
export const DELETE_FRIENDSHIP = (userId: string) =>
  `${BASE_PATH}/delete?UserId=${userId}`;
export const GET_FRIENDSHIP_LIST = `${BASE_PATH}/list`;
