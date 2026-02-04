import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { UserPlus } from 'lucide-react';

import { AddUserToChatModal } from './AddUserToChatModal';

export const AddUserToChat = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button leftSection={<UserPlus />} variant="subtle" onClick={open}>
        Добавить пользователя
      </Button>
      <AddUserToChatModal opened={opened} close={close} />
    </>
  );
};
