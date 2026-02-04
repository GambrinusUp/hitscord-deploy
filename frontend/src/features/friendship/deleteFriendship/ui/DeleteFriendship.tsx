import { Button } from '@mantine/core';
import { X } from 'lucide-react';

import { deleteFriendship } from '~/entities/friendship';
import { useAppDispatch } from '~/hooks';

interface DeleteFriendshipProps {
  userId: string;
}

export const DeleteFriendship = ({ userId }: DeleteFriendshipProps) => {
  const dispatch = useAppDispatch();

  const handleDeleteFriendship = () => {
    dispatch(deleteFriendship({ userId }));
  };

  return (
    <Button
      leftSection={<X />}
      variant="light"
      color="red"
      radius="md"
      onClick={handleDeleteFriendship}
    >
      Удалить из друзей
    </Button>
  );
};
