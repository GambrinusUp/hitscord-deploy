import {
  Divider,
  Group,
  Paper,
  Slider,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';

import { useMediaContext } from '~/context';
import { useAudioSettings, useImagePreloadSetting } from '~/shared/lib/hooks';

export const EditConfiguration = () => {
  const { micSettings, setMicSettings } = useMediaContext();
  const { volume, volumePercent, setNotificationVolume } = useAudioSettings();
  const { preloadImages, setPreloadImages } = useImagePreloadSetting();

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
