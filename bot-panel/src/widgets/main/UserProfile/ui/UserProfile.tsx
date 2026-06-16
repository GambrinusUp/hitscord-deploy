import { Avatar, Group, Loader, Menu, Stack, Text } from '@mantine/core';
import { LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useLogout, useProfile } from '~/entities/auth';

export const UserProfile = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { data: profile, isPending } = useProfile();

  if (isPending) {
    return <Loader size="sm" />;
  }

  if (!profile) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Menu position="bottom-end" shadow="md">
      <Menu.Target>
        <Group gap="xs" style={{ cursor: 'pointer' }}>
          <Avatar name={profile.name} radius="xl" size="sm" />
          <Stack gap={0}>
            <Text size="sm" fw={500}>
              {profile.name}
            </Text>
            <Text size="xs" c="dimmed">
              {profile.email}
            </Text>
          </Stack>
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        <Link
          to="/profile"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Menu.Item leftSection={<User size={16} />}>Профиль</Menu.Item>
        </Link>
        <Menu.Divider />
        <Menu.Item
          leftSection={<LogOut size={16} />}
          color="red"
          onClick={handleLogout}
        >
          Выход
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
