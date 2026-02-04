import {
  Stack,
  Text,
  Avatar,
  Tooltip,
  ActionIcon,
  Group,
  Badge,
} from '@mantine/core';
import {
  MicOff,
  Mic,
  Video,
  VideoOff,
  MonitorX,
  MonitorUp,
  PhoneMissed,
} from 'lucide-react';

import { stylesControlPanel } from './ControlPanel.style';

import { socket } from '~/api/socket';
import { useMediaContext } from '~/context';
import {
  useDisconnect,
  useScreenSharing,
  useCamera,
  useAppDispatch,
  useAppSelector,
} from '~/hooks';
import { setOpenHome, setUserStreamView } from '~/store/AppStore';
import {
  setCurrentServerId,
  setCurrentVoiceChannelId,
  setCurrentVoiceChannelName,
  setCurrentVoiceChannelServerId,
} from '~/store/ServerStore';

export const ControlPanel = () => {
  const dispatch = useAppDispatch();
  const {
    isConnected,
    toggleMute,
    isMuted,
    isUserMute,
    isStreaming,
    isCameraOn,
  } = useMediaContext();
  const disconnect = useDisconnect();
  const { startScreenSharing, stopScreenSharing } = useScreenSharing();
  const { toggleCamera } = useCamera();
  const { user, accessToken } = useAppSelector((state) => state.userStore);
  const {
    currentVoiceChannelId,
    currentVoiceChannelName,
    currentVoiceChannelServerId,
    currentServerId,
  } = useAppSelector((state) => state.testServerStore);
  const { isOpenHome } = useAppSelector((state) => state.appStore);

  const handleScreenShareClick = () => {
    if (isStreaming) {
      stopScreenSharing();
    } else {
      startScreenSharing();
    }
  };

  const handleOpenChannel = () => {
    if (currentVoiceChannelServerId === currentServerId && !isOpenHome) return;

    if (currentServerId !== currentVoiceChannelServerId) {
      dispatch(setCurrentServerId(currentVoiceChannelServerId!));

      socket.emit('setServer', {
        serverId: currentVoiceChannelServerId!,
        userName: user.name,
        userId: user.id,
      });
    }

    dispatch(setUserStreamView(true));

    if (isOpenHome) {
      dispatch(setOpenHome(false));
    }
  };

  const handleDisconnect = () => {
    disconnect(accessToken, currentVoiceChannelId!);
    dispatch(setUserStreamView(false));
    dispatch(setCurrentVoiceChannelId(null));
    dispatch(setCurrentVoiceChannelName(null));
    dispatch(setCurrentVoiceChannelServerId(null));
  };

  return (
    <Stack gap="sm" p="md" style={stylesControlPanel.container()}>
      <Group gap="sm" justify="space-between">
        <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
          <Avatar size="md" radius="xl" color="blue" style={{ flexShrink: 0 }}>
            {user.name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
            <Text size="sm" fw={500} truncate style={{ color: '#FFFFFF' }}>
              {user.name}
            </Text>
            {currentVoiceChannelName && isConnected && (
              <Group gap={4}>
                <Badge
                  size="xs"
                  variant="light"
                  color="blue"
                  style={stylesControlPanel.badge()}
                  onClick={handleOpenChannel}
                >
                  {currentVoiceChannelName}
                </Badge>
              </Group>
            )}
          </Stack>
        </Group>
      </Group>
      {isConnected && (
        <Group gap="xs" justify="center">
          <Tooltip
            label={
              isMuted || isUserMute ? 'Включить микрофон' : 'Выключить микрофон'
            }
            openDelay={500}
          >
            <ActionIcon
              variant={isMuted || isUserMute ? 'filled' : 'light'}
              color={isMuted || isUserMute ? 'red' : 'gray'}
              size="lg"
              radius="md"
              onClick={toggleMute}
              style={stylesControlPanel.microphoneIcon(isMuted || isUserMute)}
              disabled={isUserMute}
            >
              {isMuted || isUserMute ? <MicOff size={18} /> : <Mic size={18} />}
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
              style={stylesControlPanel.cameraIcon(isCameraOn)}
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
              style={stylesControlPanel.streamIcon(isStreaming)}
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
              style={stylesControlPanel.disconnectIcon()}
            >
              <PhoneMissed size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      )}
    </Stack>
  );
};
