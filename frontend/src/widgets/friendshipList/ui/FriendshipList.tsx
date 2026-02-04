import { Stack, Text } from '@mantine/core';

import { UserCard } from '~/entities/friendship';
import { DeleteFriendship } from '~/features/friendship';
import { useAppSelector } from '~/hooks';

export const FriendshipList = () => {
  const { friendshipList } = useAppSelector((state) => state.friendshipStore);

  return (
    <Stack p="xs" gap="xs">
      {friendshipList.length < 1 && <Text>У вас пока нет друзей</Text>}
      {friendshipList.map((friend) => (
        <UserCard
          key={friend.userId}
          userName={friend.userName}
          userTag={friend.userTag}
          actions={<DeleteFriendship userId={friend.userId} />}
        />
      ))}
    </Stack>
  );
};
