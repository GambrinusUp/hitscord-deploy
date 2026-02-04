import { Badge, Stack, Text } from '@mantine/core';

import { useAppSelector } from '~/hooks';
import { ChannelType } from '~/store/ServerStore';

interface ChannelRolesProps {
  channelType: ChannelType;
}

export const ChannelRoles = ({ channelType }: ChannelRolesProps) => {
  const { roleSettings } = useAppSelector((state) => state.testServerStore);

  const canSee = roleSettings.canSee;
  const canJoin = roleSettings.canJoin;
  const canWrite = roleSettings.canWrite;
  const canWriteSub = roleSettings.canWriteSub;
  const notificatedRole = roleSettings.notificated;

  return (
    <Stack gap="md">
      <Text size="lg" w={500}>
        Просмотр ролей
      </Text>
      {canSee && (
        <>
          <Text>
            Могут{' '}
            {channelType === ChannelType.TEXT_CHANNEL ? 'читать' : 'видеть'}:
          </Text>
          <Stack gap="xs">
            {canSee.map((role) => (
              <Badge
                key={role.id}
                color={role.color}
                size="lg"
                variant="light"
                radius="md"
              >
                {role.name}
              </Badge>
            ))}
          </Stack>
        </>
      )}
      {canJoin && (
        <>
          <Text>Могут присоединиться:</Text>
          <Stack gap="xs">
            {canJoin.map((role) => (
              <Badge
                key={role.id}
                color={role.color}
                size="lg"
                variant="light"
                radius="md"
              >
                {role.name}
              </Badge>
            ))}
          </Stack>
        </>
      )}
      {canWrite && (
        <>
          <Text>Могут писать:</Text>
          <Stack gap="xs">
            {canWrite.map((role) => (
              <Badge
                key={role.id}
                color={role.color}
                size="lg"
                variant="light"
                radius="md"
              >
                {role.name}
              </Badge>
            ))}
          </Stack>
        </>
      )}
      {canWriteSub && (
        <>
          <Text>Могут создавать подчаты:</Text>
          <Stack gap="xs">
            {canWriteSub.map((role) => (
              <Badge
                key={role.id}
                color={role.color}
                size="lg"
                variant="light"
                radius="md"
              >
                {role.name}
              </Badge>
            ))}
          </Stack>
        </>
      )}
      {notificatedRole && (
        <>
          <Text>Уведомляемые роли:</Text>
          <Stack gap="xs">
            {notificatedRole.map((role) => (
              <Badge
                key={role.id}
                color={role.color}
                size="lg"
                variant="light"
                radius="md"
              >
                {role.name}
              </Badge>
            ))}
          </Stack>
        </>
      )}
    </Stack>
  );
};
