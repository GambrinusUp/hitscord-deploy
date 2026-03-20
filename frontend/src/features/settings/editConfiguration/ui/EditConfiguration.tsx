import {
  Divider,
  Group,
  Paper,
  Select,
  Slider,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { useEffect } from 'react';

import { useMediaContext } from '~/context';
import { useAudioSettings, useImagePreloadSetting } from '~/shared/lib/hooks';

const SYSTEM_DEVICE_VALUE = '__system_default__';

export const EditConfiguration = () => {
  const {
    micSettings,
    setMicSettings,
    audioInputDevices,
    audioOutputDevices,
    selectedOutputDeviceId,
    setSelectedOutputDeviceId,
    refreshAudioDevices,
    switchInputDevice,
  } = useMediaContext();
  const { volume, volumePercent, setNotificationVolume } = useAudioSettings();
  const { preloadImages, setPreloadImages } = useImagePreloadSetting();
  const inputDeviceOptions = [
    { value: SYSTEM_DEVICE_VALUE, label: 'System default microphone' },
    ...audioInputDevices
      .filter((device) => Boolean(device.deviceId))
      .map((device, index) => ({
        value: device.deviceId,
        label: device.label || `Microphone ${index + 1}`,
      })),
  ];
  const outputDeviceOptions = [
    { value: SYSTEM_DEVICE_VALUE, label: 'System default output' },
    ...audioOutputDevices
      .filter((device) => Boolean(device.deviceId))
      .map((device, index) => ({
        value: device.deviceId,
        label: device.label || `Output ${index + 1}`,
      })),
  ];

  useEffect(() => {
    refreshAudioDevices();
  }, [refreshAudioDevices]);

  return (
    <Stack
      p="xl"
      gap="xl"
      w="100%"
      style={{
        background: 'var(--color-surface-1)',
      }}
    >
      <Paper
        p="lg"
        radius="lg"
        withBorder
        style={{
          background: 'var(--color-surface-2)',
          borderColor: 'var(--border-primary-soft)',
        }}
      >
        <Stack gap="lg">
          <Title order={3} c="var(--color-white)">
            Настройки микрофона
          </Title>
          <Select
            label="Устройство ввода"
            data={inputDeviceOptions}
            value={micSettings.inputDeviceId || SYSTEM_DEVICE_VALUE}
            onChange={(value) =>
              switchInputDevice(
                !value || value === SYSTEM_DEVICE_VALUE ? null : value,
              )
            }
            nothingFoundMessage="Не найдено устройств ввода"
          />
          <Select
            label="Устройство вывода"
            data={outputDeviceOptions}
            value={selectedOutputDeviceId || SYSTEM_DEVICE_VALUE}
            onChange={(value) =>
              setSelectedOutputDeviceId(
                !value || value === SYSTEM_DEVICE_VALUE ? null : value,
              )
            }
            nothingFoundMessage="Не найдено устройств вывода"
          />
          <Stack gap={6}>
            <Group justify="space-between">
              <Text size="sm" c="var(--color-white)">
                Громкость
              </Text>
              <Text size="sm" c="var(--color-white)">
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
              styles={{
                track: {
                  backgroundColor: 'var(--color-white-05)',
                },
                bar: {
                  backgroundColor: 'var(--color-primary)',
                },
                thumb: {
                  borderColor: 'var(--color-primary)',
                },
              }}
            />
          </Stack>
          <Stack gap={6}>
            <Group justify="space-between">
              <Text size="sm" c="var(--color-white)">
                Gain
              </Text>
              <Text size="sm" c="var(--color-white)">
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
              styles={{
                track: {
                  backgroundColor: 'var(--color-white-05)',
                },
                bar: {
                  backgroundColor: 'var(--color-primary)',
                },
                thumb: {
                  borderColor: 'var(--color-primary)',
                },
              }}
            />
          </Stack>
          <Switch
            label="Прослушивание микрофона"
            checked={micSettings.monitoringEnabled}
            onChange={(event) =>
              setMicSettings((prev) => ({
                ...prev,
                monitoringEnabled: event.currentTarget.checked,
              }))
            }
            styles={{
              track: {
                backgroundColor: micSettings.monitoringEnabled
                  ? 'var(--color-primary)'
                  : 'var(--color-white-05)',
              },
            }}
          />
          <Stack gap={6}>
            <Group justify="space-between">
              <Text size="sm" c="var(--color-white)">
                Громкость прослушивания
              </Text>
              <Text size="sm" c="var(--color-white)">
                {micSettings.monitoringVolume}%
              </Text>
            </Group>
            <Slider
              min={0}
              max={100}
              step={1}
              value={micSettings.monitoringVolume}
              onChange={(value) =>
                setMicSettings((prev) => ({
                  ...prev,
                  monitoringVolume: value,
                }))
              }
              disabled={!micSettings.monitoringEnabled}
              styles={{
                track: {
                  backgroundColor: 'var(--color-white-05)',
                },
                bar: {
                  backgroundColor: 'var(--color-primary)',
                },
                thumb: {
                  borderColor: 'var(--color-primary)',
                },
              }}
            />
          </Stack>
          <Divider color="var(--color-white-05)" />
          <Stack gap="sm">
            <Switch
              label="Шумоподавление"
              checked={micSettings.noiseSuppression}
              onChange={(event) =>
                setMicSettings((prev) => ({
                  ...prev,
                  noiseSuppression: event.currentTarget.checked,
                }))
              }
              styles={{
                track: {
                  backgroundColor: micSettings.noiseSuppression
                    ? 'var(--color-primary)'
                    : 'var(--color-white-05)',
                },
              }}
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
              styles={{
                track: {
                  backgroundColor: micSettings.echoCancellation
                    ? 'var(--color-primary)'
                    : 'var(--color-white-05)',
                },
              }}
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
              styles={{
                track: {
                  backgroundColor: micSettings.autoGainControl
                    ? 'var(--color-primary)'
                    : 'var(--color-white-05)',
                },
              }}
            />
          </Stack>
        </Stack>
      </Paper>
      <Paper
        p="lg"
        radius="lg"
        withBorder
        style={{
          background: 'var(--color-surface-2)',
          borderColor: 'var(--border-primary-soft)',
        }}
      >
        <Stack gap="lg">
          <Title order={3} c="var(--color-white)">
            Настройки звука уведомлений
          </Title>
          <Stack gap={6}>
            <Group justify="space-between">
              <Text size="sm" c="var(--color-white)">
                Громкость уведомлений
              </Text>
              <Text size="sm" c="var(--color-white)">
                {volumePercent}%
              </Text>
            </Group>
            <Slider
              min={0}
              max={0.525}
              step={0.035}
              value={volume}
              onChange={setNotificationVolume}
              label={(value) => `${Math.round((value / 0.35) * 100)}%`}
              styles={{
                track: {
                  backgroundColor: 'var(--color-white-05)',
                },
                bar: {
                  backgroundColor: 'var(--color-primary)',
                },
                thumb: {
                  borderColor: 'var(--color-primary)',
                },
              }}
            />
          </Stack>
        </Stack>
      </Paper>
      <Paper
        p="lg"
        radius="lg"
        withBorder
        style={{
          background: 'var(--color-surface-2)',
          borderColor: 'var(--border-primary-soft)',
        }}
      >
        <Stack gap="lg">
          <Title order={3} c="var(--color-white)">
            Настройки сообщений
          </Title>
          <Switch
            label="Предзагрузка картинок"
            checked={preloadImages}
            onChange={(event) => setPreloadImages(event.currentTarget.checked)}
            styles={{
              track: {
                backgroundColor: preloadImages
                  ? 'var(--color-primary)'
                  : 'var(--color-white-05)',
              },
            }}
          />
        </Stack>
      </Paper>
    </Stack>
  );
};
