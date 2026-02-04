import { Button } from '@mantine/core';
import { LogOut } from 'lucide-react';

import { goOutFromChat, setActiveChat } from '~/entities/chat';
import { useAppDispatch } from '~/hooks';

interface LeaveChatProps {
  chatId: string | undefined;
}

export const LeaveChat = ({ chatId }: LeaveChatProps) => {
  const dispatch = useAppDispatch();

  const handleGoOut = async () => {
    if (!chatId) return;

    const result = await dispatch(goOutFromChat({ id: chatId }));

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(setActiveChat(null));
    }
  };

  return (
    <Button
      leftSection={<LogOut />}
      variant="subtle"
      color="red"
      onClick={handleGoOut}
    >
      Покинуть чат
    </Button>
  );
};
