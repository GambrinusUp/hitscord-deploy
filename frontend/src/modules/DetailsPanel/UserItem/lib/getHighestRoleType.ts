import { RoleType } from '~/store/RolesStore';
import { UserOnServer } from '~/store/ServerStore';

export const getHighestRoleType = (user: UserOnServer): RoleType => {
  if (!user.roles || user.roles.length === 0) {
    return RoleType.Uncertain;
  }

  const roleTypes = user.roles
    .filter((role) => role.roleType !== undefined)
    .map((role) => role.roleType);

  if (roleTypes.includes(RoleType.Creator)) {
    return RoleType.Creator;
  }

  if (roleTypes.includes(RoleType.Admin)) {
    return RoleType.Admin;
  }

  if (roleTypes.includes(RoleType.Custom)) {
    return RoleType.Custom;
  }

  return RoleType.Uncertain;
};
