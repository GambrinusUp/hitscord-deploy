import {
  Stack,
  Text,
  Avatar,
  Tooltip,
  ActionIcon,
  Group,
  Badge,
  Modal,
  Slider,
  Switch,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  MicOff,
  Mic,
  Video,
  VideoOff,
  MonitorX,
  MonitorUp,
  PhoneMissed,
  SlidersHorizontal,
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
    micSettings,
    setMicSettings,
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
  const [settingsOpened, { open: openSettings, close: closeSettings }] =
    useDisclosure(false);

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

          <Tooltip label="Настройки микрофона" openDelay={500}>
            <ActionIcon
              variant="light"
              color="gray"
              size="lg"
              radius="md"
              onClick={openSettings}
              style={stylesControlPanel.settingsIcon()}
            >
              <SlidersHorizontal size={18} />
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
      <Modal
        opened={settingsOpened}
        onClose={closeSettings}
        centered
        title="Настройки микрофона"
      >
        <Stack gap="md">
          <Stack gap={6}>
            <Group justify="space-between">
              <Text size="sm">Громкость</Text>
              <Text size="sm" c="dimmed">
                {micSettings.volume}%
              </Text>
            </Group>
            <Slider
              min={0}
              max={100}
              step={1}
              value={micSettings.volume}
              onChange={(value) =>
                setMicSettings((prev) => ({ ...prev, volume: value }))
              }
            />
          </Stack>
          <Stack gap={6}>
            <Group justify="space-between">
              <Text size="sm">Gain</Text>
              <Text size="sm" c="dimmed">
                {micSettings.gainDb} dB
              </Text>
            </Group>
            <Slider
              min={-10}
              max={20}
              step={1}
              value={micSettings.gainDb}
              onChange={(value) =>
                setMicSettings((prev) => ({ ...prev, gainDb: value }))
              }
            />
          </Stack>
          <Switch
            label="Шумоподавление"
            checked={micSettings.noiseSuppression}
            onChange={(event) =>
              setMicSettings((prev) => ({
                ...prev,
                noiseSuppression: event.currentTarget.checked,
              }))
            }
          />
          <Switch
            label="Эхоподавление"
            checked={micSettings.echoCancellation}
            onChange={(event) =>
              setMicSettings((prev) => ({
                ...prev,
                echoCancellation: event.currentTarget.checked,
              }))
            }
          />
          <Switch
            label="Автоусиление"
            checked={micSettings.autoGainControl}
            onChange={(event) =>
              setMicSettings((prev) => ({
                ...prev,
                autoGainControl: event.currentTarget.checked,
              }))
            }
          />
        </Stack>
      </Modal>
    </Stack>
  );
};
