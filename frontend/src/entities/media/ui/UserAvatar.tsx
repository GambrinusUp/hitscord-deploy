import { Avatar } from '@mantine/core';
import { memo, useMemo } from 'react';

import { MessageType, useMessageAuthor } from '~/entities/message';
import { useIcon } from '~/shared/lib/hooks';

interface UserAvatarProps {
  userName: string;
  userId: string;
}

export const UserAvatar = memo(({ userName, userId }: UserAvatarProps) => {
  const { getUserIcon } = useMessageAuthor(MessageType.CHANNEL);
  const userIcon = useMemo(() => getUserIcon(userId!), [getUserIcon, userId]);
  const { iconBase64 } = useIcon(userIcon);

  return (
    <Avatar
      radius="xl"
      size="xl"
      color="blue"
      src={iconBase64}
      style={{
        width: '80px',
        height: '80px',
      }}
    >
      {userName[0]}
    </Avatar>
  );
});

UserAvatar.displayName = 'UserAvatar';
