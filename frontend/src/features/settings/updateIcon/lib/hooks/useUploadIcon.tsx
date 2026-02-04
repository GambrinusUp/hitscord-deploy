import { changeChatIcon } from '~/entities/chat';
import { changeProfileIcon } from '~/entities/user';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { changeServerIcon } from '~/store/ServerStore';

interface UseUploadIconProps {
  type: 'profile' | 'server' | 'chat';
}

export const useUploadIcon = ({ type }: UseUploadIconProps) => {
  const dispatch = useAppDispatch();
  const { currentServerId } = useAppSelector((state) => state.testServerStore);
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const { showSuccess, showError } = useNotification();

  const validateAndUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      showError('Файл слишком большой (макс. 10 МБ)');

      return;
    }

    if (!file.type.startsWith('image/')) {
      showError('Файл не является изображением!');

      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () =>
          reject(new Error('Невозможно загрузить изображение'));
        img.src = objectUrl;
      });

      if (img.width > 650 || img.height > 650) {
        showError('Изображение слишком большое (макс. 650×650)');

        return;
      }
    } finally {
      URL.revokeObjectURL(objectUrl);
    }

    if (type === 'profile') {
      const result = await dispatch(changeProfileIcon({ icon: file }));

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Аватарка успешно установлена');
      }
    }

    if (type === 'server' && currentServerId) {
      const result = await dispatch(
        changeServerIcon({ serverId: currentServerId, icon: file }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Иконка сервера успешно установлена');
      }
    }

    if (type === 'chat' && activeChat) {
      const result = await dispatch(
        changeChatIcon({ chatId: activeChat, icon: file }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Иконка чата успешно установлена');
      }
    }
  };

  return { validateAndUpload };
};
