import { Avatar, Group, Stack, Text } from '@mantine/core';

import { UpdateIcon } from '~/features/settings/updateIcon';
import { useAppSelector } from '~/hooks';
import { useIcon } from '~/shared/lib/hooks';

export const IconChange = () => {
  const { serverData } = useAppSelector((state) => state.testServerStore);
  const { serverName, icon } = serverData;
  const { iconBase64 } = useIcon(icon?.fileId);

  return (
    <Stack gap="md">
      <Text size="lg" w={500}>
        Иконка сервера
      </Text>
      <Group gap="md">
        <Avatar size="xl" color="blue" src={iconBase64}>
          {serverName[0]}
        </Avatar>
        <Stack>
          <Text>{icon ? 'Иконка загружена' : ' Иконка не загружена'}</Text>
          <UpdateIcon type={'server'} />
        </Stack>
      </Group>
    </Stack>
  );
};
