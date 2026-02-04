import { useDisclosure } from '@mantine/hooks';

import { CreateChat, ChatsList } from '~/features/chat';

export const ChatsPage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ChatsList onCreateChatClick={open} />
      <CreateChat opened={opened} onClose={close} />
    </>
  );
};
