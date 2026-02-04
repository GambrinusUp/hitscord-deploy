import { LoadingState } from '~/shared';

export enum SystemRoleTypeEnum {
  Student,
  Teacher,
}

export interface SystemRole {
  id: string;
  type: SystemRoleTypeEnum;
  name: string;
  parentId: string;
  parentName: string;
}

export interface GetSystemRoles {
  roles: SystemRole[];
}

export interface GetPresets {
  presets: Preset[];
  total: number;
}

export interface PresetDto {
  serverId: string;
  serverRoleId: string;
  systemRoleId: string;
}

export interface Preset {
  serverRoleId: string;
  serverRoleName: string;
  systemRoleId: string;
  systemRoleName: string;
  systemRoleType: SystemRoleTypeEnum;
}

export interface PresetsState {
  presets: Preset[];
  systemRoles: SystemRole[];
  presetsLoading: LoadingState;
  systemRolesLoading: LoadingState;
  error: string;
}
