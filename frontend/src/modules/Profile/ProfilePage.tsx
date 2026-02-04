import { useEffect, useState } from 'react';

import {
  getApplicationsFrom,
  getApplicationsTo,
  getFriendshipList,
} from '~/entities/friendship';
import { CreateChat, ChatsList } from '~/features/chat';
import { AddFriend } from '~/features/friendship';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { ApplicationFromList } from '~/widgets/applicationFromList';
import { ApplicationToList } from '~/widgets/applicationToList';
import { ChatSection } from '~/widgets/chatSection';
import { FriendshipList } from '~/widgets/friendshipList';
import { MessagesList } from '~/widgets/messagesList';
import { Profile } from '~/widgets/profile';
import { ProfileContent } from '~/widgets/profileContent';
import { ProfileMenu } from '~/widgets/profileMenu';
import { Settings } from '~/widgets/settings';
import { UserApplications } from '~/widgets/userApplications';
import { ChatUsers } from '~/widgets/сhatUsers';

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const [activeLink, setActiveLink] = useState<
    'friends' | 'settings' | 'chats' | 'serverApplications'
  >('chats');

  useEffect(() => {
    dispatch(getApplicationsFrom());
    dispatch(getApplicationsTo());
    dispatch(getFriendshipList());
  }, []);

  return (
    <>
      <ProfileMenu activeLink={activeLink} setActiveLink={setActiveLink} />
      <ProfileContent
        activeLink={activeLink}
        ChatSection={ChatSection}
        MessagesList={MessagesList}
        Settings={Settings}
        FriendshipList={FriendshipList}
        ApplicationFromList={ApplicationFromList}
        ApplicationToList={ApplicationToList}
        ChatsList={ChatsList}
        CreateChat={CreateChat}
        AddFriend={AddFriend}
        UserApplications={UserApplications}
      />
      {activeChat && <ChatUsers />}
      {!activeChat && activeLink !== 'settings' && <Profile />}
    </>
  );
};
