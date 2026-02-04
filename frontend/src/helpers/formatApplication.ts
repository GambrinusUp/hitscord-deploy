import { formatIcon } from './formatUser';

import { Application, Friend } from '~/entities/friendship';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatFriend = (rawFriend: any): Friend => ({
  userId: rawFriend.UserId,
  userName: rawFriend.UserName,
  userTag: rawFriend.UserTag,
  icon: rawFriend.Icon ? formatIcon(rawFriend.Icon) : null,
  notifiable: rawFriend.Notifiable,
  friendshipApplication: rawFriend.FriendshipApplication,
  nonFriendMessage: rawFriend.NonFriendMessage,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatApplication = (rawApplication: any): Application => ({
  id: rawApplication.Id,
  user: formatFriend(rawApplication.User),
  createdAt: rawApplication.CreatedAt,
});
