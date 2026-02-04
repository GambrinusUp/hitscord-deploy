import { SettingType } from '~/entities/user/model/types';

const BASE_PATH = '/auth';

export const REGISTER_USER = `${BASE_PATH}/registration`;
export const LOGIN_USER = `${BASE_PATH}/login`;
export const GET_PROFILE = `${BASE_PATH}/profile/get`;
export const LOGOUT = `${BASE_PATH}/logout`;
export const REFRESH = `${BASE_PATH}/refresh`;
export const CHANGE_SETTINGS = (type: SettingType) =>
  `${BASE_PATH}/settings/${type}`;
export const CHANGE_NOTIFICATION_LIFETIME = `${BASE_PATH}/settings/notification/lifetime`;
export const CHANGE_PROFILE = `${BASE_PATH}/profile/change`;
export const CHANGE_PROFILE_ICON = `${BASE_PATH}/icon`;
export const GET_USER_DATA = (userId: string) =>
  `${BASE_PATH}/data?UserId=${userId}`;
