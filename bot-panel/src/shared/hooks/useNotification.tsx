import { notifications } from '@mantine/notifications';
import { CircleCheck, CircleX } from 'lucide-react';

export const useNotification = () => {
  const showSuccess = (message: string) => {
    notifications.show({
      message,
      position: 'top-center',
      color: 'green',
      radius: 'md',
      autoClose: 2000,
      icon: <CircleCheck />,
    });
  };

  const showError = (message: string) => {
    notifications.show({
      title: 'Ошибка',
      message,
      position: 'top-center',
      color: 'red',
      radius: 'md',
      autoClose: 2000,
      icon: <CircleX />,
    });
  };

  return { showSuccess, showError };
};
