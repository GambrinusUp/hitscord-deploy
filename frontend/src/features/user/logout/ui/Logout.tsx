import { ActionIcon } from '@mantine/core';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { clearUserData, logoutUser } from '~/entities/user';
import { useAppDispatch } from '~/hooks';
import { clearServerData } from '~/store/ServerStore';

export const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());
   
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(clearServerData());
      dispatch(clearUserData());
      navigate('/');
    }
  };

  return (
    <ActionIcon size="lg" variant="transparent" onClick={handleLogout}>
      <LogOut size={24} color="#fff" />
    </ActionIcon>
  );
};
