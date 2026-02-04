import { RoomGroup, UserGroup } from './types';

import { Room } from '~/shared';

export const getUserGroups = (rooms: Room[]): RoomGroup[] => {
  return rooms.map((room) => {
    const usersGroup = room.users.reduce(
      (acc, user) => {
        if (!acc[user.socketId]) {
          acc[user.socketId] = {
            userName: user.userName,
            userId: user.userId,
            producers: [],
          };
        }
        acc[user.socketId].producers.push({
          producerId: user.producerId,
          source: user.source,
        });

        return acc;
      },
      {} as Record<string, UserGroup>,
    );

    return {
      roomName: room.roomName,
      users: usersGroup,
    };
  });
};
