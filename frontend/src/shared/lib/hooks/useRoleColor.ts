import { useAppSelector } from '~/hooks';

export const useRoleColor = () => {
  const { roles } = useAppSelector((state) => state.testServerStore.serverData);

  const getRoleColor = (roleId: string): string => {
    const role = roles.find((role) => role.id == roleId);

    if (role) {
      return role.color;
    }

    return '';
  };

  return { getRoleColor };
};
