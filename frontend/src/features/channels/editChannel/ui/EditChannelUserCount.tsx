import { Button, Group, NumberInput, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { changeVoiceChannelMaxCount } from '~/store/ServerStore';

interface EditChannelUserCountProps {
  channelId: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

export const EditChannelUserCount = ({
  channelId,
  loading,
  setLoading,
  onClose,
}: EditChannelUserCountProps) => {
  const dispatch = useAppDispatch();
  const { serverData } = useAppSelector((state) => state.testServerStore);
  const { showSuccess } = useNotification();
  const [count, setCount] = useState<string | number>(1);

  const handleChangeChannelCount = async () => {
    setLoading(true);
    const result = await dispatch(
      changeVoiceChannelMaxCount({
        voiceChannelId: channelId,
        maxCount: Number(count),
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      setLoading(false);
      showSuccess('Настройки успешно обновлены');
      onClose();
    }
  };

  useEffect(() => {
    const voiceChannelData = serverData.channels.voiceChannels.find(
      (channel) => channel.channelId === channelId,
    );

    if (voiceChannelData) {
      setCount(voiceChannelData?.maxCount);
    }
  }, [serverData]);

  return (
    <Stack gap="md">
      <Text size="lg" w={500}>
        Смена кол-ва числа пользователей
      </Text>
      <Group align="center">
        <NumberInput
          label="Введите число"
          placeholder="Число от 2 до 999"
          value={count}
          onChange={setCount}
          min={2}
          max={999}
        />
      </Group>
      <Button onClick={handleChangeChannelCount} loading={loading}>
        Изменить настройки
      </Button>
    </Stack>
  );
};
