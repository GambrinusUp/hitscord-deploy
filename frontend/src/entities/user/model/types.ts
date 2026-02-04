import { FileResponse } from '~/entities/files';
import { SystemRoleTypeEnum } from '~/entities/presets';
import { LoadingState } from '~/shared';

export interface RegisterCredentials {
  mail: string;
  password: string;
  accountName: string;
}

export interface LoginCredentials {
  mail: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserSystemRole {
  name: string;
  type: SystemRoleTypeEnum;
}

export interface User {
  id: string;
  name: string;
  tag: string;
  mail: string;
  accontCreateDate: string;
  notifiable: boolean;
  friendshipApplication: boolean;
  nonFriendMessage: boolean;
  icon: FileResponse | null;
  notificationLifeTime: number;
  systemRoles: UserSystemRole[];
}

export enum SettingType {
  NOTIFIABLE = 'notifiable',
  FRIENDSHIP = 'friendship',
  NONFRIEND = 'nonfriend',
}

export interface ChangeProfileData {
  name: string;
  mail: string;
}

export interface UserState {
  user: User;
  accessToken: string;
  refreshToken: string;
  isLoggedIn: boolean;
  error: string;
  loading: LoadingState;
}

export interface SettingsForm {
  email: string;
  name: string;
  notifiable: boolean;
  friendshipApplication: boolean;
  nonFriendMessage: boolean;
  notificationLifeTime: number;
}

export interface UserData {
  userId: string;
  userName: string;
  userTag: string;
  icon: FileResponse | null;
  notifiable: boolean;
  friendshipApplication: boolean;
  nonFriendMessage: boolean;
}
