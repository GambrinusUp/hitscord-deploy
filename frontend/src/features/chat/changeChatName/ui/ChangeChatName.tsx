import { ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

import { ChangeChatNameModal } from './ChangeChatNameModal';

import { ChatInfo } from '~/entities/chat';
import { useAppSelector } from '~/hooks';

export const ChangeChatName = () => {
  const { chat } = useAppSelector((state) => state.chatsStore);
  const [opened, { open, close }] = useDisclosure(false);
  const [currentChat, setCurrentChat] = useState<ChatInfo | null>(null);

  const handleChangeName = () => {
    setCurrentChat(chat);
    open();
  };

  return (
    <>
      <ActionIcon variant="subtle" aria-label="Edit" onClick={handleChangeName}>
        <Pencil size={20} />
      </ActionIcon>
      <ChangeChatNameModal
        opened={opened}
        close={close}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
      />
    </>
  );
};
