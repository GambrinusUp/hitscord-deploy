import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Plus } from 'lucide-react';

import { AddFriendModal } from './AddFriendModal';

export const AddFriend = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button leftSection={<Plus />} onClick={open}>
        Добавить друга
      </Button>
      <AddFriendModal opened={opened} close={close} />
    </>
  );
};
