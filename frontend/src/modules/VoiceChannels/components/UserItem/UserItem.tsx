import { Group, Menu, Slider, Text } from '@mantine/core';
import { MicOff, Unplug, User, Video, Volume2 } from 'lucide-react';

import { UserItemProps } from './UserItem.types';

import { useAppSelector } from '~/hooks';

export const UserItem = ({
  socketId,
  isSpeaking,
  userName,
  producerIds,
  userVolume,
  handleVolumeChange,
  handleOpenStream,
  handleKickUser,
  channelId,
  userId,
  handleMuteUser,
}: UserItemProps) => {
  /*const roleType = useAppSelector(
    (state) => state.testServerStore.serverData.userRoleType,
  );*/
  const { isCreator } = useAppSelector(
    (state) => state.testServerStore.serverData,
  );
  const canWorkChannels = useAppSelector(
    (state) => state.testServerStore.serverData.permissions.canWorkChannels,
  );
  const { voiceChannels } = useAppSelector(
    (state) => state.testServerStore.serverData.channels,
  );
  const users = voiceChannels.find(
    (channel) => channel.channelId === channelId,
  )?.users;
  const { user } = useAppSelector((state) => state.userStore);
  /*const userRoleType = useAppSelector((state) =>
    state.testServerStore.serverData.users.find(
      (user) => user.userId === userId,
    ),
  )?.roleType;*/
  const currentUser = users?.find((user) => user.userId === userId);

  const isMuted = currentUser?.muteStatus === 1;
  const isSelfMuted = currentUser?.muteStatus === 2;

  return (
    <Menu key={socketId} shadow="md" width={200} closeOnItemClick={true}>
      <Menu.Target>
        <Group
          style={{
            cursor: 'pointer',
            overflow: 'hidden',
            width: '100%',
            minWidth: 0,
          }}
          wrap="nowrap"
        >
          <User
            color={isSpeaking ? '#43b581' : undefined}
            style={{ flexShrink: 0 }}
          />
          {(isSelfMuted || isMuted) && (
            <MicOff
              color={isSelfMuted ? '#ff0000' : '#43b581'}
              size={20}
              style={{ flexShrink: 0 }}
            />
          )}
          <Text
            style={{
              flex: 1,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-word',
              lineHeight: '1.2em',
              maxHeight: '2.4em',
              minWidth: 0,
            }}
            title={userName}
          >
            {userName}
          </Text>
          {producerIds.length > 1 && (
            <Video
              color="#43b581"
              style={{
                marginLeft: 'auto',
                flexShrink: 0,
              }}
            />
          )}
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        {userId !== user.id && (
          <Menu.Item leftSection={<Volume2 />}>
            <Slider
              label="Громкость"
              value={userVolume}
              onChange={(value) => handleVolumeChange(socketId, value)}
              min={1}
              max={100}
            />
          </Menu.Item>
        )}
        {producerIds.length > 1 && (
          <Menu.Item
            leftSection={<Video />}
            onClick={() => handleOpenStream(socketId)}
          >
            Открыть стрим
          </Menu.Item>
        )}
        {(isCreator || canWorkChannels) &&
          //Number(roleType) <= Number(userRoleType) &&
          userId !== user.id && (
            <Menu.Item
              leftSection={<Unplug />}
              onClick={() => handleKickUser(socketId)}
            >
              Отключить пользователя
            </Menu.Item>
          )}
        {(isCreator || canWorkChannels) &&
          //Number(roleType) <= Number(userRoleType) &&
          userId !== user.id && (
            <>
              {!isSelfMuted ? (
                <Menu.Item
                  leftSection={<MicOff />}
                  onClick={() => handleMuteUser(userId!, isSelfMuted)}
                >
                  Оключить звук пользователя
                </Menu.Item>
              ) : (
                <Menu.Item
                  leftSection={<MicOff />}
                  onClick={() => handleMuteUser(userId!, isSelfMuted)}
                >
                  Включить звук пользователя
                </Menu.Item>
              )}
            </>
          )}
      </Menu.Dropdown>
    </Menu>
  );
};
