import { NavLink, Stack } from '@mantine/core';
import {
  BookUser,
  ChevronRight,
  MessagesSquare,
  Server,
  Settings,
  UserPen,
} from 'lucide-react';

import { setActiveChat } from '~/entities/chat';
import { useAppDispatch } from '~/hooks';

interface ProfileMenuProps {
  activeLink:
    | 'friends'
    | 'profileSettings'
    | 'settings'
    | 'chats'
    | 'serverApplications';
  setActiveLink: React.Dispatch<
    React.SetStateAction<
      | 'friends'
      | 'profileSettings'
      | 'settings'
      | 'chats'
      | 'serverApplications'
    >
  >;
}

export const ProfileMenu = ({
  activeLink,
  setActiveLink,
}: ProfileMenuProps) => {
  const dispatch = useAppDispatch();

  const handleOpenChats = () => {
    setActiveLink('chats');
    dispatch(setActiveChat(null));
  };

  const handleOpenFriends = () => {
    setActiveLink('friends');
    dispatch(setActiveChat(null));
  };

  const handleOpenProfileSettings = () => {
    setActiveLink('profileSettings');
    dispatch(setActiveChat(null));
  };

  const handleOpenApplicationSettings = () => {
    setActiveLink('settings');
    dispatch(setActiveChat(null));
  };

  const handleOpenServerApplication = () => {
    setActiveLink('serverApplications');
    dispatch(setActiveChat(null));
  };

  return (
    <Stack
      gap="xs"
      bg="#1A1B1E"
      w="100%"
      maw={250}
      h="100%"
      visibleFrom="sm"
      p={10}
    >
      <NavLink
        label="Чаты"
        leftSection={<MessagesSquare size={16} />}
        rightSection={<ChevronRight size={12} />}
        active={activeLink === 'chats'}
        onClick={handleOpenChats}
      />
      <NavLink
        label="Друзья"
        leftSection={<BookUser size={16} />}
        rightSection={<ChevronRight size={12} />}
        active={activeLink === 'friends'}
        onClick={handleOpenFriends}
      />
      <NavLink
        label="Настройки профиля"
        leftSection={<UserPen size={16} />}
        rightSection={<ChevronRight size={12} />}
        active={activeLink === 'profileSettings'}
        onClick={handleOpenProfileSettings}
      />
      <NavLink
        label="Настройки приложения"
        leftSection={<Settings size={16} />}
        rightSection={<ChevronRight size={12} />}
        active={activeLink === 'settings'}
        onClick={handleOpenApplicationSettings}
      />
      <NavLink
        label="Заявки на вступление в сервер"
        leftSection={<Server size={16} />}
        rightSection={<ChevronRight size={12} />}
        active={activeLink === 'serverApplications'}
        onClick={handleOpenServerApplication}
      />
    </Stack>
  );
};
