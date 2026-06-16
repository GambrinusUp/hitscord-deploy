import { Avatar, Group, Loader, Menu, Stack, Text } from '@mantine/core';
import { LayoutDashboard, User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import { UserRole, useProfile } from '~/entities/auth';
import { LogoutButton } from '~/features/auth/logout';

interface UserMenuProps {
  showName?: boolean;
}

export const UserMenu = ({ showName = true }: UserMenuProps) => {
  const { data: profile, isPending } = useProfile();

  if (isPending) {
    return <Loader size="sm" />;
  }

  if (!profile) {
    return null;
  }

  return (
    <Menu position="bottom-end" shadow="md">
      <Menu.Target>
        <Group gap="xs" style={{ cursor: 'pointer' }}>
          <Avatar name={profile.name} radius="xl" size="sm" />
          {showName && (
            <Stack gap={0}>
              <Text size="sm" fw={500}>
                {profile.name}
              </Text>
              <Text size="xs" c="dimmed">
                {profile.email}
              </Text>
            </Stack>
          )}
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        {profile.role === UserRole.ADMIN ? (
          <Link
            to="/admin/developers"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Menu.Item leftSection={<Users size={16} />}>
              Разработчики
            </Menu.Item>
          </Link>
        ) : (
          <Link
            to="/dashboard"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Menu.Item leftSection={<LayoutDashboard size={16} />}>
              Дашборд
            </Menu.Item>
          </Link>
        )}
        <Link
          to="/profile"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Menu.Item leftSection={<User size={16} />}>Профиль</Menu.Item>
        </Link>
        <Menu.Divider />
        <Menu.Item
          closeMenuOnClick
          component="div"
          p={0}
          style={{ overflow: 'visible' }}
        >
          <LogoutButton
            color="red"
            variant="subtle"
            size="xs"
            fullWidth={true}
          />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
