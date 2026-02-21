import { Flex, Stack, Title, Tabs, Box, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

import { ChatMessage } from '~/entities/chat';
import { MessageType } from '~/entities/message';
import { EditConfiguration } from '~/features/settings';
import { useAppSelector } from '~/hooks';
import { ChannelMessage } from '~/store/ServerStore';

interface ProfileContentProps {
  activeLink:
    | 'friends'
    | 'profileSettings'
    | 'settings'
    | 'chats'
    | 'serverApplications';
  ChatSection: React.ComponentType<{
    MessagesList: React.ComponentType<{
      scrollRef: React.RefObject<HTMLDivElement>;
      type: MessageType;
      replyToMessage: (message: ChatMessage | ChannelMessage) => void;
      onEditMessage?: (message: ChatMessage | ChannelMessage) => void;
      onScrollToReplyMessage?: (replyMessageId: number) => void;
    }>;
  }>;
  MessagesList: React.ComponentType<{
    scrollRef: React.RefObject<HTMLDivElement>;
    type: MessageType;
    replyToMessage: (message: ChatMessage | ChannelMessage) => void;
    onEditMessage?: (message: ChatMessage | ChannelMessage) => void;
    onScrollToReplyMessage?: (replyMessageId: number) => void;
  }>;
  Settings: React.ComponentType;
  FriendshipList: React.ComponentType;
  ApplicationFromList: React.ComponentType;
  ApplicationToList: React.ComponentType;
  ChatsList: React.ComponentType<{ onCreateChatClick: () => void }>;
  CreateChat: React.ComponentType<{ opened: boolean; onClose: () => void }>;
  AddFriend: React.ComponentType;
  UserApplications: React.ComponentType;
}

export const ProfileContent = ({
  activeLink,
  ChatSection,
  MessagesList,
  Settings,
  FriendshipList,
  ApplicationFromList,
  ApplicationToList,
  ChatsList,
  CreateChat,
  AddFriend,
  UserApplications,
}: ProfileContentProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const [activeTab, setActiveTab] = useState<string | null>('friends');

  return (
    <Box
      style={{
        flex: 1,

        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#2C2E33',
      }}
    >
      <Flex w="100%" h="100%" justify="center">
        {activeLink === 'chats' && (
          <>
            {!activeChat ? (
              <>
                <ChatsList onCreateChatClick={open} />
                <CreateChat opened={opened} onClose={close} />
              </>
            ) : (
              <ChatSection MessagesList={MessagesList} />
            )}
          </>
        )}
        {activeLink === 'profileSettings' && <Settings />}
        {activeLink === 'settings' && <EditConfiguration />}
        {activeLink === 'friends' && (
          <Stack gap="xs" w="100%" h="100%" p={10}>
            <Group justify="space-between" mb="md">
              <Title order={1}>Друзья</Title>
              <AddFriend />
            </Group>
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              styles={{
                tab: {
                  '--tab-hover-color': '#4f4f4f',
                },
              }}
              w="100%"
            >
              <Tabs.List>
                <Tabs.Tab value="friends">Ваши друзья</Tabs.Tab>
                <Tabs.Tab value="applicationFrom">Исходящие заявки</Tabs.Tab>
                <Tabs.Tab value="applicationTo">Входящие заявки</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="friends">
                <FriendshipList />
              </Tabs.Panel>
              <Tabs.Panel value="applicationFrom">
                <ApplicationFromList />
              </Tabs.Panel>
              <Tabs.Panel value="applicationTo">
                <ApplicationToList />
              </Tabs.Panel>
            </Tabs>
          </Stack>
        )}
        {activeLink === 'serverApplications' && <UserApplications />}
      </Flex>
    </Box>
  );
};
