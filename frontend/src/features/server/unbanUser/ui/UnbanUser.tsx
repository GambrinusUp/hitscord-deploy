import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Pagination,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { Calendar } from 'lucide-react';
import { useEffect } from 'react';

import { stylesUnbanUser } from './UnbanUser.style';

import { formatDateTime } from '~/helpers';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { getBannedUsers, unbanUser } from '~/store/ServerStore';

interface UnbanUserProps {
  opened: boolean;
  loading: boolean;
  setLoading: (value: React.SetStateAction<boolean>) => void;
}

export const UnbanUser = ({ opened, loading, setLoading }: UnbanUserProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const {
    currentServerId,
    serverData,
    bannedUsers,
    pageBannedUsers,
    totalPagesBannedUsers,
  } = useAppSelector((state) => state.testServerStore);

  const canDeleteUsers = serverData.permissions.canDeleteUsers;

  const handleUnbanUser = async (userId: string) => {
    if (currentServerId) {
      setLoading(true);

      const result = await dispatch(
        unbanUser({
          serverId: currentServerId,
          userId: userId,
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setLoading(false);
        showSuccess('Пользователь успешно разблокирован');
      }
    }
  };

  const handleChangePage = (value: number) => {
    if (pageBannedUsers < totalPagesBannedUsers && currentServerId) {
      dispatch(
        getBannedUsers({
          serverId: currentServerId,
          page: value,
          size: 5,
        }),
      );
    }
  };

  useEffect(() => {
    if (canDeleteUsers && currentServerId && opened) {
      dispatch(
        getBannedUsers({
          serverId: currentServerId,
          page: 1,
          size: 5,
        }),
      );
    }
  }, [canDeleteUsers, currentServerId, opened]);

  return (
    <Stack gap="md">
      <Text size="lg" fw={500}>
        Разблокировать пользователя
      </Text>
      {bannedUsers.length < 1 && <Text>Нет заблокированных пользователей</Text>}
      {bannedUsers &&
        bannedUsers.map((user) => (
          <Card key={user.userId} withBorder p="md">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Group wrap="nowrap" align="flex-start">
                <Avatar radius="xl" size="lg" color="blue">
                  {user.userName[0]}
                </Avatar>
                <Stack gap={4}>
                  <Stack gap={0}>
                    <Text fw={500}>{user.userName}</Text>
                    <Text c="dimmed" size="sm">
                      {user.userTag}
                    </Text>
                  </Stack>

                  {user.banReason && (
                    <Tooltip multiline w={400} label={user.banReason}>
                      <Badge
                        variant="light"
                        style={stylesUnbanUser.banReason()}
                      >
                        {user.banReason}
                      </Badge>
                    </Tooltip>
                  )}
                </Stack>
              </Group>
              <Stack align="flex-end" gap={8}>
                <Group gap={6}>
                  <Calendar size={16} />
                  <Text size="sm">{formatDateTime(user.banTime)}</Text>
                </Group>
                <Button
                  variant="light"
                  size="xs"
                  onClick={() => handleUnbanUser(user.userId)}
                  loading={loading}
                  disabled={loading}
                >
                  Разблокировать
                </Button>
              </Stack>
            </Group>
          </Card>
        ))}
      <Flex w="100%" justify="center">
        {bannedUsers.length > 0 && (
          <Pagination
            total={totalPagesBannedUsers}
            value={pageBannedUsers}
            onChange={handleChangePage}
          />
        )}
      </Flex>
    </Stack>
  );
};
