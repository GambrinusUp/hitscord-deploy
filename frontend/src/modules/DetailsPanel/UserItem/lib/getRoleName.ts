import { RoleType } from '~/store/RolesStore';

export const getRoleName = (roleType: RoleType): string => {
  switch (roleType) {
    case RoleType.Creator:
      return 'Создатель';
    case RoleType.Admin:
      return 'Администратор';
    case RoleType.Custom:
      return 'Пользователь';
    case RoleType.Uncertain:
      return 'Без роли';
    default:
      return 'Пользователь';
  }
};
