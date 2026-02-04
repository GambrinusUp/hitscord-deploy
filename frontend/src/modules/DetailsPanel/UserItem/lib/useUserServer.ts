import { useCallback } from 'react';

import { useAppSelector } from '~/hooks';

export const useUserServer = () => {
  const usersOnServer = useAppSelector(
    (state) => state.testServerStore.serverData.users,
  );

  const getUserIcon = useCallback(
    (userId: string) => {
      const userIcon = usersOnServer.find(
        (user) => user.userId === userId,
      )?.icon;

      return userIcon?.fileId;
    },
    [usersOnServer],
  );

  return { getUserIcon };
};
