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
  const { isOpenHome } = useAppSelector((state) => state.appStore);
  const { currentServerId } = useAppSelector((state) => state.testServerStore);

  const { iconBase64 } = useIcon(serverIcon?.fileId);
  const isActive = currentServerId === serverId && !isOpenHome;

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
    <Box pos="relative" w={56} h={56} style={{ cursor: 'pointer' }}>
      <Box
        pos="absolute"
        left={-8}
        top="50%"
        style={{
          transform: 'translateY(-50%)',
          width: 4,
          height: isActive ? 28 : 0,
          borderRadius: 4,
          background: 'var(--color-primary)',
          transition: 'all 0.2s ease',
        }}
      />
      <ActionIcon
        size={56}
        radius="xl"
        variant="transparent"
        onClick={handleClick}
        style={{
          background: isActive ? 'var(--color-primary-15)' : 'transparent',
          transition: 'all 0.2s ease',
        }}
      >
        <Avatar
          size={40}
          radius="xl"
          src={iconBase64}
          style={{
            border: isActive
              ? '2px solid var(--color-primary)'
              : '2px solid transparent',
            transition: 'all 0.2s ease',
          }}
        >
          {serverName.charAt(0).toUpperCase()}
        </Avatar>
      </ActionIcon>
      {nonReadedTaggedCount > 0 && (
        <Badge
          variant="filled"
          size="sm"
          circle
          pos="absolute"
          top={30}
          right={30}
          w={18}
          h={18}
          p={0}
          style={{
            background: '#ef4444',
            border: '2px solid #0E0E10',
            fontSize: 10,
          }}
        >
          {nonReadedTaggedCount > 9 ? '9+' : nonReadedTaggedCount}
        </Badge>
      )}
      {nonReadedCount > 0 && (
        <Badge
          variant="filled"
          size="sm"
          circle
          pos="absolute"
          top={5}
          right={30}
          w={18}
          h={18}
          p={0}
          style={{
            background: 'var(--color-primary)',
            border: '2px solid #0E0E10',
            fontSize: 10,
          }}
        >
          {nonReadedCount > 9 ? '9+' : nonReadedCount}
        </Badge>
      )}
    </Box>
  );
};
