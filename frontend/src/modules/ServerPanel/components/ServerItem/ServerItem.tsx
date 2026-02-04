import { ActionIcon, Avatar, Badge, Box } from '@mantine/core';

import { ServerItemProps } from './ServerItem.types';

import { socket } from '~/api/socket';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { useIcon } from '~/shared/lib/hooks';
import { setOpenHome, setUserStreamView } from '~/store/AppStore';
import { setCurrentServerId } from '~/store/ServerStore';

export const ServerItem = ({
  serverId,
  serverName,
  nonReadedCount,
  nonReadedTaggedCount,
  serverIcon,
}: ServerItemProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userStore);

  const { iconBase64 } = useIcon(serverIcon?.fileId);

  const handleClick = () => {
    dispatch(setCurrentServerId(serverId));
    dispatch(setUserStreamView(false));
    dispatch(setOpenHome(false));
    socket.emit('setServer', {
      serverId,
      userName: user.name,
      userId: user.id,
    });
  };

  return (
    <Box 
      pos="relative"
      w={48}
      h={48}
      style={{ cursor: 'pointer' }}
    >
      <ActionIcon
        size="xl"
        radius="xl"
        variant="transparent"
        onClick={handleClick}
      >
        <Avatar size="md" color="blue" src={iconBase64}>
          {serverName.charAt(0).toUpperCase()}
        </Avatar>
      </ActionIcon>
      {nonReadedTaggedCount > 0 && (
        <Badge
          color="red"
          variant="filled"
          size="sm"
          circle
          pos="absolute"
          top={24}
          right={30}
          w={20}
          h={20}
          p={0}
          style={{
            border: '2px solid #0E0E10',
          }}
        >
          {nonReadedTaggedCount > 9 ? '9+' : nonReadedTaggedCount}
        </Badge>
      )}
      {nonReadedCount > 0 && (
        <Badge
          color="blue"
          variant="filled"
          size="sm"
          circle
          pos="absolute"
          top={0}
          right={30}
          w={20}
          h={20}
          p={0}
          style={{
            border: '2px solid #0E0E10',
          }}
        >
          {nonReadedCount > 9 ? '9+' : nonReadedCount}
        </Badge>
      )}
    </Box>
  );
};
