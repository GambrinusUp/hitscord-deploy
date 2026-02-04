import { useCallback } from 'react';

import { MessageType } from '~/entities/message/model/types';
import { getUserData } from '~/entities/user';
import { UserData } from '~/entities/user/model/types';
import { useAppSelector } from '~/hooks';

const userCache: Record<string, UserData> = {};

const userLoadingMap = new Map<string, Promise<UserData>>();

export const useMessageAuthor = (type: MessageType) => {
  const usersOnServer = useAppSelector(
    (state) => state.testServerStore.serverData.users,
  );

  const usersOnChat = useAppSelector((state) => state.chatsStore.chat.users);

  const loadUserIfMissing = useCallback(async (authorId: string) => {
    if (userCache[authorId]) return;

    let promise = userLoadingMap.get(authorId);

    if (!promise) {
      promise = getUserData(authorId)
        .then((user) => {
          userCache[authorId] = user;

          return user;
        })
        .catch((e) => {
          console.error(`Failed to load user ${authorId}`, e);
          throw e;
        })
        .finally(() => {
          userLoadingMap.delete(authorId);
        });

      userLoadingMap.set(authorId, promise);
    }

    await promise;
  }, []);

  const findLocalUser = useCallback(
    (authorId: string) => {
      switch (type) {
        case MessageType.CHAT:
          return usersOnChat.find((u) => u.userId === authorId);
        case MessageType.CHANNEL:
        case MessageType.SUBCHAT:
          return usersOnServer.find((u) => u.userId === authorId);
        default:
          return undefined;
      }
    },
    [type, usersOnChat, usersOnServer],
  );

  const getUsername = useCallback(
    (authorId: string) => {
      const local = findLocalUser(authorId);

      if (local) return local.userName;

      const cached = userCache[authorId];

      if (cached) return cached.userName;

      loadUserIfMissing(authorId);

      return undefined;
    },
    [findLocalUser, loadUserIfMissing],
  );

  const getUserIcon = useCallback(
    (authorId: string) => {
      const local = findLocalUser(authorId);

      if (local) return local.icon?.fileId;

      const cached = userCache[authorId];

      if (cached) return cached.icon?.fileId;

      loadUserIfMissing(authorId);

      return undefined;
    },
    [findLocalUser, loadUserIfMissing],
  );

  return { getUsername, getUserIcon };
};
