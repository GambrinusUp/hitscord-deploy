import { FileResponse } from '~/entities/files';
import { SystemRole } from '~/entities/presets';
import {
  UserOnServer,
  UserRoleOnServer,
} from '~/store/ServerStore/ServerStore.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatUserRole = (rawRole: any): UserRoleOnServer => ({
  roleId: rawRole.RoleId,
  roleName: rawRole.RoleName,
  roleType: rawRole.RoleType,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatIcon = (rawIcon: any): FileResponse => {
  return {
    fileId: rawIcon.FileId,
    fileName: rawIcon.FileName,
    fileType: rawIcon.FileType,
    fileSize: rawIcon.FileSize,
    base64File: rawIcon.Base64File,
  };
};

export const formatSystemRoles = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawSystemRoles: any,
): Omit<SystemRole, 'id' | 'parentId' | 'parentName'> => {
  return {
    name: rawSystemRoles.Name,
    type: rawSystemRoles.Type,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatUser = (rawMessage: any): UserOnServer => ({
  serverId: rawMessage.ServerId,
  userId: rawMessage.UserId,
  userName: rawMessage.UserName,
  userTag: rawMessage.UserTag,
  icon: rawMessage.Icon ? formatIcon(rawMessage.Icon) : null,
  notifiable: rawMessage.Notifiable,
  friendshipApplication: rawMessage.FriendshipApplication,
  nonFriendMessage: rawMessage.NonFriendMessage,
  roles: rawMessage.Roles ? rawMessage.Roles.map(formatUserRole) : [],
  isFriend: rawMessage.IsFriend,
  systemRoles: rawMessage.SystemRoles.map(formatSystemRoles),
});
