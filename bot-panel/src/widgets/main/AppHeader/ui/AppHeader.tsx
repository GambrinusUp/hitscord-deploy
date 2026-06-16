import { ActionIcon, AppShell, Burger, Button, Group, Menu, Text } from '@mantine/core';
import { Bot, Menu as MenuIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { UserRole, useProfile } from '~/entities/auth';
import { UserMenu } from '~/features/auth';
import { ThemeSwitcher } from '~/features/theme/ThemeSwitcher';
import { useAppSelector } from '~/shared';

interface AppHeaderProps {
  opened: boolean;
  toggle: () => void;
  showMenuButton?: boolean;
}

export const AppHeader = ({
  opened,
  toggle,
  showMenuButton = false,
}: AppHeaderProps) => {
  const { isLoggedIn } = useAppSelector((state) => state.authStore);
  const { data: profile } = useProfile({ enabled: isLoggedIn });

  const panelPath =
    profile?.role === UserRole.ADMIN ? '/admin/developers' : '/dashboard';
  const panelLabel =
    profile?.role === UserRole.ADMIN ? 'Разработчики' : 'Дашборд';

  return (
    <AppShell.Header>
      <Group h="100%" px="md" wrap="nowrap">
        {showMenuButton && (
          <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
        )}
        <Group justify="space-between" align="center" w="100%" wrap="nowrap" style={{ minWidth: 0 }}>
          <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
            <Bot />
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text size="lg" fw={700} truncate>
                BotPanel
              </Text>
            </Link>
          </Group>
          <Group gap="xs" visibleFrom="sm" wrap="nowrap">
            {isLoggedIn && profile && (
              <Link to={panelPath}>
                <Button radius="md" variant="subtle">
                  {panelLabel}
                </Button>
              </Link>
            )}
            <Link to="/docs">
              <Button radius="md" variant="subtle">
                Документация
              </Button>
            </Link>
            <ThemeSwitcher />
            {isLoggedIn ? (
              <UserMenu />
            ) : (
              <>
                <Link to="/login">
                  <Button radius="md" variant="subtle">
                    Войти
                  </Button>
                </Link>
                <Link to="/register">
                  <Button radius="md" variant="filled">
                    Зарегистрироваться
                  </Button>
                </Link>
              </>
            )}
          </Group>
          <Group gap="xs" hiddenFrom="sm" wrap="nowrap">
            <ThemeSwitcher />
            {isLoggedIn && <UserMenu showName={false} />}
            <Menu position="bottom-end" shadow="md" width={220}>
              <Menu.Target>
                <ActionIcon variant="subtle" size="lg" aria-label="Открыть меню">
                  <MenuIcon size={20} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {isLoggedIn && profile && (
                  <Menu.Item component={Link} to={panelPath}>
                    {panelLabel}
                  </Menu.Item>
                )}
                <Menu.Item component={Link} to="/docs">
                  Документация
                </Menu.Item>
                {!isLoggedIn && (
                  <>
                    <Menu.Item component={Link} to="/login">
                      Войти
                    </Menu.Item>
                    <Menu.Item component={Link} to="/register">
                      Зарегистрироваться
                    </Menu.Item>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Group>
    </AppShell.Header>
  );
};
