import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  CopyButton,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { Check, Copy, UserPlus } from 'lucide-react';

import { stylesUserMiniProfile } from './UserMiniProfile.style';

import { UserInChat } from '~/entities/chat';
import { createApplication } from '~/entities/friendship';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { useRoleColor } from '~/shared/lib/hooks';
import { UserOnServer } from '~/store/ServerStore';

interface UserMiniProfileProps {
  userOnServer: UserOnServer | UserInChat;
  userIcon: string | null;
}

export const UserMiniProfile = ({
  userOnServer,
  userIcon,
}: UserMiniProfileProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { getRoleColor } = useRoleColor();
  const { applicationFrom } = useAppSelector((state) => state.friendshipStore);
  const { user } = useAppSelector((state) => state.userStore);

  const {
    userName,
    userTag,
    userId,
    notifiable,
    nonFriendMessage,
    systemRoles,
  } = userOnServer;
  const userRoles = 'roles' in userOnServer ? userOnServer.roles : [];

  const application = applicationFrom.find((app) => app.user.userId === userId);

  const handleAddFriend = async () => {
    const result = await dispatch(
      createApplication({
        userTag,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Запрос на дружбу отправлен');
    }
  };

  return (
    <Stack gap="xs" justify="center" align="center" w="100%">
      <Avatar size="lg" color="blue" src={userIcon}>
        {userName[0]}
      </Avatar>
      <Text c="white" style={stylesUserMiniProfile.userName()}>
        {userName}
      </Text>
      <Group>
        <Text c="dimmed" style={stylesUserMiniProfile.userTag()}>
          {userTag}
        </Text>
        <CopyButton value={userTag} timeout={2000}>
          {({ copied, copy }) => (
            <Tooltip
              label={copied ? 'Скопировано' : 'Скопировать'}
              withArrow
              position="right"
            >
              <ActionIcon
                color={copied ? 'teal' : 'gray'}
                variant="subtle"
                onClick={copy}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Group>
      <Group gap="sm">
        {userRoles.map((role) => (
          <Badge
            key={role.roleId}
            color={getRoleColor(role.roleId)}
            radius="md"
            variant="light"
            style={stylesUserMiniProfile.roleName()}
          >
            {role.roleName}
          </Badge>
        ))}
      </Group>
      {user.id !== userId && (
        <Button
          leftSection={<UserPlus />}
          variant="light"
          radius="md"
          onClick={handleAddFriend}
          disabled={application ? true : false}
        >
          {application ? 'Заявка отправлена' : 'Добавить в друзья'}
        </Button>
      )}
      <Divider color="dimmed" w="100%" />
      <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
        <Stack gap={0} align="center" justify="center">
          <Text c="dimmed">Уведомления</Text>
          <Text fw={700}>{notifiable ? 'Включены' : 'Отключены'}</Text>
        </Stack>
        <Stack gap={0} align="center" justify="center">
          <Text c="dimmed">Сообщения</Text>
          <Text fw={700}>{nonFriendMessage ? 'Включены' : 'Отключены'}</Text>
        </Stack>
      </SimpleGrid>
      <Divider color="dimmed" w="100%" />
      <Group gap="sm">
        {systemRoles.map((role) => (
          <Badge
            key={role.name}
            radius="md"
            variant="light"
            style={stylesUserMiniProfile.roleName()}
          >
            {role.name}
          </Badge>
        ))}
      </Group>
    </Stack>
  );
};
