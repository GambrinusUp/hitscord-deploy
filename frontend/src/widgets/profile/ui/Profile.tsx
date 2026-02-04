import { Avatar, Box, Stack, Text, Title, Tooltip } from '@mantine/core';

import { formatDateWithDots } from '~/helpers';
import { useAppSelector } from '~/hooks';
import { useIcon } from '~/shared/lib/hooks';

export const Profile = () => {
  const { user } = useAppSelector((state) => state.userStore);
  const { iconBase64 } = useIcon(user.icon?.fileId);

  return (
    <Box
      style={{ padding: '10px', backgroundColor: '#1A1B1E' }}
      w={{ base: 300 }}
      visibleFrom="sm"
    >
      <Stack gap="md" align="center">
        <Avatar size={80} radius="xl" src={iconBase64} alt={user.name} />
        <Tooltip label={user.name} withArrow>
          <Title
            order={3}
            style={{
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            }}
          >
            {user.name}
          </Title>
        </Tooltip>
        <Tooltip label={user.tag} withArrow>
          <Text
            c="gray"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              display: 'block',
            }}
          >
            Usertag: {user.tag}
          </Text>
        </Tooltip>
        <Tooltip label={user.mail} withArrow>
          <Text
            c="gray"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              display: 'block',
            }}
          >
            E-mail: {user.mail}
          </Text>
        </Tooltip>
        <Text c="gray">
          Аккаунт создан: {formatDateWithDots(user.accontCreateDate)}
        </Text>
      </Stack>
    </Box>
  );
};
