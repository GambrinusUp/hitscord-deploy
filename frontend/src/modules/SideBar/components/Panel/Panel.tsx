import {
  ActionIcon,
  Avatar,
  Badge,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  Mic,
  MicOff,
  MonitorUp,
  MonitorX,
  PhoneMissed,
  Video,
  VideoOff,
} from 'lucide-react';

import { useMediaContext } from '~/context';
import {
  useDisconnect,
  useScreenSharing,
  useAppDispatch,
  useAppSelector,
  useCamera,
} from '~/hooks';
import { setUserStreamView } from '~/store/AppStore';
import { setCurrentVoiceChannelId } from '~/store/ServerStore';

export const Panel = () => {
  const { isConnected, toggleMute, isMuted, isStreaming, isCameraOn } =
    useMediaContext();
  const disconnect = useDisconnect();
  const { startScreenSharing, stopScreenSharing } = useScreenSharing();
  const { toggleCamera } = useCamera();

  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.userStore);
  const { currentVoiceChannelId, serverData } = useAppSelector(
    (state) => state.testServerStore,
  );

  const currentVoiceChannel = serverData.channels?.voiceChannels?.find(
    (channel) => channel.channelId === currentVoiceChannelId,
  );
  const channelName = currentVoiceChannel?.channelName || null;

  const handleScreenShareClick = () => {
    if (isStreaming) {
      stopScreenSharing();
    } else {
      startScreenSharing();
    }
  };

  const handleDisconnect = () => {
    disconnect(accessToken, currentVoiceChannelId!);
    dispatch(setUserStreamView(false));
    dispatch(setCurrentVoiceChannelId(null));
  };

  return (
    <Stack
      gap="sm"
      p="md"
      style={{
        backgroundColor: '#1A1B1E',
        borderTop: '1px solid #2C2E33',
        borderRadius: '8px',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Group gap="sm" justify="space-between">
        <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
          <Avatar size="md" radius="xl" color="blue" style={{ flexShrink: 0 }}>
            {user.name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
            <Text size="sm" fw={500} truncate style={{ color: '#FFFFFF' }}>
              {user.name}
            </Text>
            {channelName && isConnected && (
              <Group gap={4}>
                <Badge
                  size="xs"
                  variant="light"
                  color="blue"
                  style={{
                    backgroundColor: '#25262B',
                    color: '#A0A0A0',
                    border: '1px solid #373A40',
                  }}
                >
                  {channelName}
                </Badge>
              </Group>
            )}
          </Stack>
        </Group>
      </Group>
      {isConnected && (
        <Group gap="xs" justify="center">
          <Tooltip
            label={isMuted ? 'Включить микрофон' : 'Выключить микрофон'}
            openDelay={500}
          >
            <ActionIcon
              variant={isMuted ? 'filled' : 'light'}
              color={isMuted ? 'red' : 'gray'}
              size="lg"
              radius="md"
              onClick={toggleMute}
              style={{
                backgroundColor: isMuted ? '#FA5252' : '#2C2E33',
                color: '#FFFFFF',
                border: 'none',
              }}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </ActionIcon>
          </Tooltip>

          <Tooltip
            label={isCameraOn ? 'Выключить камеру' : 'Включить камеру'}
            openDelay={500}
          >
            <ActionIcon
              variant={isCameraOn ? 'filled' : 'light'}
              color={isCameraOn ? 'blue' : 'gray'}
              size="lg"
              radius="md"
              onClick={toggleCamera}
              style={{
                backgroundColor: isCameraOn ? '#228BE6' : '#2C2E33',
                color: '#FFFFFF',
                border: 'none',
              }}
            >
              {isCameraOn ? <Video size={18} /> : <VideoOff size={18} />}
            </ActionIcon>
          </Tooltip>

          <Tooltip
            label={
              isStreaming ? 'Остановить стрим экрана' : 'Начать стрим экрана'
            }
            openDelay={500}
          >
            <ActionIcon
              variant={isStreaming ? 'filled' : 'light'}
              color={isStreaming ? 'green' : 'gray'}
              size="lg"
              radius="md"
              onClick={handleScreenShareClick}
              style={{
                backgroundColor: isStreaming ? '#51CF66' : '#2C2E33',
                color: '#FFFFFF',
                border: 'none',
              }}
            >
              {isStreaming ? <MonitorX size={18} /> : <MonitorUp size={18} />}
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Отключиться" openDelay={500}>
            <ActionIcon
              variant="light"
              color="red"
              size="lg"
              radius="md"
              onClick={handleDisconnect}
              style={{
                backgroundColor: '#2C2E33',
                color: '#FA5252',
                border: 'none',
              }}
            >
              <PhoneMissed size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      )}
    </Stack>
  );
};
