import { Button } from '@mantine/core';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useLogout } from '~/entities/auth';

interface LogoutButtonProps {
  color?: string;
  variant?: 'filled' | 'light' | 'outline' | 'default' | 'subtle';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  onLogoutComplete?: () => void;
}

export const LogoutButton = ({
  color = 'red',
  variant = 'filled',
  size = 'md',
  fullWidth = false,
  onLogoutComplete,
}: LogoutButtonProps) => {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    onLogoutComplete?.();
    navigate('/');
  };

  return (
    <Button
      color={color}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      leftSection={<LogOut size={20} />}
      onClick={handleLogout}
    >
      Выход
    </Button>
  );
};
