import {
  Avatar,
  Badge,
  Box,
  Divider,
  Paper,
  Stack,
  Title,
  Tooltip,
} from '@mantine/core';

import { InfoItem } from './InfoItem';

import { formatDateWithDots } from '~/helpers';
import { useAppSelector } from '~/hooks';
import { useIcon } from '~/shared/lib/hooks';

export const Profile = () => {
  const { user } = useAppSelector((state) => state.userStore);
  const { iconBase64 } = useIcon(user.icon?.fileId);

  return (
    <Box
      w={{ base: 300 }}
      visibleFrom="sm"
      p="md"
      style={{
        background: 'var(--color-surface-1)',
        borderRight: '1px solid var(--border-primary-soft)',
      }}
    >
      <Paper
        radius="lg"
        p="lg"
        withBorder
        style={{
          background: 'var(--color-surface-2)',
          borderColor: 'var(--border-primary-soft)',
        }}
      >
        <Stack gap="lg" align="center">
          <Box
            style={{
              padding: 4,
              borderRadius: '50%',
              background: 'var(--color-primary-15)',
            }}
          >
            <Avatar size={90} radius="xl" src={iconBase64} alt={user.name} />
          </Box>
          <Tooltip label={user.name} withArrow>
            <Title
              order={3}
              c="var(--color-white)"
              ta="center"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'wrap',
                maxWidth: '100%',
              }}
            >
              {user.name}
            </Title>
          </Tooltip>
          <Tooltip label={user.tag} withArrow>
            <Badge
              styles={{
                root: {
                  background: 'var(--color-primary-10)',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--border-primary-soft)',
                },
              }}
            >
              @{user.tag}
            </Badge>
          </Tooltip>
          <Divider w="100%" color="var(--color-white-05)" />
          <Stack gap="sm" w="100%">
            <InfoItem label="E-mail" value={user.mail} />
            <InfoItem
              label="Аккаунт создан"
              value={formatDateWithDots(user.accontCreateDate)}
            />
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};
