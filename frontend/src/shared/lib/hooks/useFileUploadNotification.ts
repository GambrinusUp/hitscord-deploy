import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';

export const useFileUploadNotification = (loading: boolean) => {
  useEffect(() => {
    const id = 'file-upload';

    if (loading) {
      notifications.show({
        id,
        loading: true,
        title: 'Загрузка файла',
        message: 'Файл загружается...',
        autoClose: false,
        withCloseButton: false,
      });
    } else {
      notifications.update({
        id,
        title: 'Готово',
        message: 'Файл успешно загружен',
        loading: false,
        autoClose: 2000,
        withCloseButton: true,
      });
    }
  }, [loading]);
};
