import { notifications } from '@mantine/notifications';
import { CircleAlert } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { useSound } from 'use-sound';

import { WebSocketContext } from './WebSocketContext';

import { useMediaContext } from '~/context';
import {
  addChat,
  addChatMessage,
  addUserInChatWs,
  changeChatReadedCount,
  deleteChatMessageWS,
  editChatMessageWS,
  readOwnChatMessage,
  updateChatIcon,
  updateChatVoteWs,
} from '~/entities/chat';
import {
  addApplicationTo,
  addApplicationFrom,
  approveApplicationTo,
  approveApplicationFrom,
  removeApplicationTo,
  removeApplicationFrom,
  removeFriend,
} from '~/entities/friendship';
import {
  addSubChatMessage,
  deleteSubChatMessageWS,
  editSubChatMessageWS,
  updateSubChatVoteWs,
} from '~/entities/subChat';
import { Vote } from '~/entities/vote';
import { formatMessage, formatNotification, formatUser } from '~/helpers';
import { formatApplication } from '~/helpers/formatApplication';
import { formatChatMessage, formatMessageFile } from '~/helpers/formatMessage';
import { formatSystemRoles } from '~/helpers/formatUser';
import {
  useAppDispatch,
  useNotification,
  useAppSelector,
  useDisconnect,
} from '~/hooks';
import sound from '~/shared/static/zapsplat_multimedia_notification_alert_ping_bright_chime_001_93276.mp3';
import { setOpenHome } from '~/store/AppStore';
import {
  addMessage,
  deleteMessageWs,
  editMessageWs,
  CreateMessageWs,
  EditMessageWs,
  DeleteMessageWs,
  ReadMessageWs,
  changeReadedCount,
  readOwnMessage,
  addUserOnVoiceChannel,
  addUserWs,
  deleteUserWs,
  editChannelName,
  getServerData,
  removeServer,
  removeUser,
  removeUserFromVoiceChannel,
  setNewServerName,
  setNewUserName,
  updateVoteWs,
  UserRoleOnServer,
  updateServerIcon,
  changeUserMuteStatusWs,
  addRoleToUserWs,
  removeRoleFromUserWs,
} from '~/store/ServerStore';

export const WebSocketProvider = (props: React.PropsWithChildren) => {
  const [play] = useSound(sound, { volume: 0.35 });
  const dispatch = useAppDispatch();
  const disconnect = useDisconnect();
  const { showMessage, showError } = useNotification();
  const { accessToken, user } = useAppSelector((state) => state.userStore);
  const {
    currentServerId,
    currentVoiceChannelId,
    serverData,
    currentChannelId,
    currentNotificationChannelId,
  } = useAppSelector((state) => state.testServerStore);
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const wsRef = useRef<WebSocket | null>(null);
  const { setIsUserMute } = useMediaContext();

  const serverIdRef = useRef<string | null>(null);
  const userIdRef = useRef<string | undefined>(undefined);
  const userRolesIds = useRef<UserRoleOnServer[]>([]);
  const currentVoiceChannelIdRef = useRef(currentVoiceChannelId);
  const notificationLifeTimeRef = useRef(0);
  const currentChannelIdRef = useRef<string | null>(null);
  const currentNotificationChannelIdRef = useRef<string | null>(null);
  const currentChatIdRef = useRef<string | null>(null);

  useEffect(() => {
    serverIdRef.current = currentServerId;
  }, [currentServerId]);

  useEffect(() => {
    userIdRef.current = user.id;
  }, [user]);

  useEffect(() => {
    currentVoiceChannelIdRef.current = currentVoiceChannelId;
  }, [currentVoiceChannelId]);

  useEffect(() => {
    notificationLifeTimeRef.current = user.notificationLifeTime;
  }, [user.notificationLifeTime]);

  useEffect(() => {
    userRolesIds.current = serverData.userRoles;
  }, [serverData]);

  useEffect(() => {
    currentChannelIdRef.current = currentChannelId;
  }, [currentChannelId]);

  useEffect(() => {
    currentNotificationChannelIdRef.current = currentNotificationChannelId;
  }, [currentNotificationChannelId]);

  useEffect(() => {
    currentChatIdRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    if (accessToken) {
      const ws = new WebSocket(
        `wss://166664.msk.web.highserver.ru/api/wss?accessToken=${accessToken}`,
      );

      ws.onopen = () => {
        setInterval(
          () => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'ping' }));
            }
          },
          5 * 60 * 1000,
        );
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        const currentServerIdValue = serverIdRef.current;
        const currentVoiceChannelIdValue = currentVoiceChannelIdRef.current;
        const notificationLifeTimeValue = notificationLifeTimeRef.current;
        const userRolesIdsValue = userRolesIds.current;
        const currentNotificationChannelIdValue =
          currentNotificationChannelIdRef.current;
        const currentChannelIdValue = currentChannelIdRef.current;
        const currentChatIdValue = currentChatIdRef.current;
        const userIdValue = userIdRef.current;

        console.log(data);

        if (data.MessageType === 'New user on server') {
          const formattedUser = formatUser(data.Payload);
          const { ServerId } = data.Payload;

          if (currentServerIdValue === ServerId) {
            dispatch(addUserWs(formattedUser));
          }
        }

        if (data.MessageType === 'User unsubscribe') {
          const { UserId, ServerId } = data.Payload;

          if (currentServerIdValue === ServerId) {
            dispatch(deleteUserWs({ UserId, ServerId }));
          }
        }

        if (data.MessageType === 'Role changed') {
          const { ServerId } = data.Payload;

          if (
            accessToken &&
            currentServerIdValue &&
            currentServerIdValue === ServerId
          ) {
            dispatch(getServerData({ serverId: currentServerIdValue }));
          }
        }

        if (
          data.MessageType === 'New channel' ||
          data.MessageType === 'Channel deleted'
        ) {
          if (accessToken && currentServerIdValue) {
            if (
              data.Payload.ChannelType === 1 &&
              data.Payload.ChannelId === currentVoiceChannelIdValue
            ) {
              disconnect(accessToken, currentVoiceChannelIdValue!);
            }

            if (currentServerIdValue === data.Payload.ServerId) {
              dispatch(getServerData({ serverId: currentServerIdValue }));
            }
          }
        }

        if (data.MessageType === 'New server name') {
          if (currentServerIdValue === data.Payload.Id) {
            dispatch(setNewServerName({ name: data.Payload.Name }));
          }
        }

        if (data.MessageType === 'New users name on server') {
          if (currentServerIdValue === data.Payload.ServerId) {
            dispatch(
              setNewUserName({
                userId: data.Payload.UserId,
                name: data.Payload.Name,
              }),
            );
          }
        }

        if (data.MessageType === 'User unsubscribe') {
          if (currentServerIdValue === data.Payload.ServerId) {
            dispatch(removeUser({ userId: data.Payload.UserId }));
          }
        }

        if (data.MessageType === 'You removed from server') {
          notifications.show({
            title: 'Уведомление',
            message: 'Вы были исключены из сервера',
            position: 'top-center',
            color: 'red',
            radius: 'md',
            autoClose: 2000,
            icon: <CircleAlert />,
          });

          if (data.Payload.IsNeedRemoveFromVC) {
            disconnect(accessToken, currentVoiceChannelIdValue!);
          }
          dispatch(setOpenHome(true));
          dispatch(removeServer({ serverId: data.Payload.ServerId }));
        }

        if (data.MessageType === 'Server deleted') {
          notifications.show({
            title: 'Уведомление',
            message: `Сервер ${data.Payload.ServerName} был удален`,
            position: 'top-center',
            color: 'red',
            radius: 'md',
            autoClose: 2000,
            icon: <CircleAlert />,
          });

          disconnect(accessToken, currentVoiceChannelIdValue!);
          dispatch(setOpenHome(true));
          dispatch(removeServer({ serverId: data.Payload.ServerId }));
        }

        if (data.MessageType === 'Change channel name') {
          if (data.Payload.ServerId === currentServerIdValue) {
            dispatch(
              editChannelName({
                channelId: data.Payload.ChannelId,
                newName: data.Payload.Name,
              }),
            );
          }
        }

        if (data.MessageType === 'New user in voice channel') {
          if (data.Payload.ServerId === currentServerIdValue) {
            dispatch(
              addUserOnVoiceChannel({
                channelId: data.Payload.ChannelId,
                userId: data.Payload.UserId,
                muteStatus: data.Payload.MuteStatus,
              }),
            );
          }
        }

        if (data.MessageType === 'User remove from voice channel') {
          if (data.Payload.ServerId === currentServerIdValue) {
            dispatch(
              removeUserFromVoiceChannel({
                channelId: data.Payload.ChannelId,
                userId: data.Payload.UserId,
              }),
            );
          }
        }

        if (data.MessageType === 'User change his mute status') {
          const { ServerId, ChannelId, UserId, MuteStatus } = data.Payload;

          if (ServerId === currentServerIdValue) {
            dispatch(
              changeUserMuteStatusWs({
                channelId: ChannelId,
                userId: UserId,
                muteStatus: Number(MuteStatus),
              }),
            );
          }
        }

        if (data.MessageType === 'Voice channel settings edited') {
          const { ServerId, RoleId } = data.Payload;

          const containsRole = userRolesIdsValue.find(
            (role) => role.roleId === RoleId,
          );

          if (containsRole) {
            if (currentServerIdValue === ServerId) {
              dispatch(getServerData({ serverId: ServerId }));
            }
          }
        }

        if (data.MessageType === 'New role') {
          const { ServerId } = data.Payload;

          if (currentServerIdValue === ServerId) {
            dispatch(getServerData({ serverId: ServerId }));
          }
        }

        if (data.MessageType === 'Updated role settings') {
          const { ServerId, RoleId } = data.Payload.Role;

          const containsRole = userRolesIdsValue.find(
            (role) => role.roleId === RoleId,
          );

          if (containsRole) {
            if (currentServerIdValue === ServerId) {
              dispatch(getServerData({ serverId: ServerId }));
            }
          }
        }

        if (data.MessageType === 'Voice channel settings edited') {
          const { ServerId, RoleId } = data.Payload;

          const containsRole = userRolesIdsValue.find(
            (role) => role.roleId === RoleId,
          );

          if (containsRole) {
            if (currentServerIdValue === ServerId) {
              dispatch(getServerData({ serverId: ServerId }));
            }
          }
        }

        if (data.MessageType === 'Text channel settings edited') {
          const { ServerId, RoleId } = data.Payload;

          const containsRole = userRolesIdsValue.find(
            (role) => role.roleId === RoleId,
          );

          if (containsRole) {
            if (currentServerIdValue === ServerId) {
              dispatch(getServerData({ serverId: ServerId }));
            }
          }
        }

        // Добавить id сообщения (подчата), для изменения настройки
        if (data.MessageType === 'Sub channel settings edited') {
          const { ServerId, RoleId } = data.Payload;

          const containsRole = userRolesIdsValue.find(
            (role) => role.roleId === RoleId,
          );

          if (containsRole) {
            if (currentServerIdValue && currentServerIdValue === ServerId) {
              dispatch(getServerData({ serverId: currentServerIdValue }));
            }
          }
        }

        if (data.MessageType === 'Notification channel settings edited') {
          const { ServerId, RoleId } = data.Payload;

          const containsRole = userRolesIdsValue.find(
            (role) => role.roleId === RoleId,
          );

          if (containsRole) {
            if (currentServerIdValue && currentServerIdValue === ServerId) {
              dispatch(getServerData({ serverId: currentServerIdValue }));
            }
          }
        }

        if (data.MessageType === 'New message in text channel') {
          const formattedMessage = formatMessage(data.Payload);

          if (formattedMessage.id) {
            dispatch(addMessage(formattedMessage));

            if (formattedMessage.authorId !== user.id) {
              dispatch(
                changeReadedCount({
                  channelId: formattedMessage.channelId,
                  readedMessageId: formattedMessage.id,
                  serverId: formattedMessage.serverId!,
                  isTagged: formattedMessage.isTagged
                    ? formattedMessage.isTagged
                    : false,
                }),
              );
            } else {
              dispatch(
                readOwnMessage({
                  channelId: formattedMessage.channelId,
                  readedMessageId: formattedMessage.id,
                  serverId: formattedMessage.serverId!,
                  isTagged: formattedMessage.isTagged
                    ? formattedMessage.isTagged
                    : false,
                }),
              );
            }
          }
        }

        if (data.MessageType === 'New message in notification channel') {
          const formattedMessage = formatMessage(data.Payload);

          if (formattedMessage.id) {
            dispatch(addMessage(formattedMessage));

            if (formattedMessage.authorId !== user.id) {
              dispatch(
                changeReadedCount({
                  channelId: formattedMessage.channelId,
                  readedMessageId: formattedMessage.id,
                  serverId: formattedMessage.serverId!,
                  isTagged: formattedMessage.isTagged!,
                }),
              );
            } else {
              dispatch(
                readOwnMessage({
                  channelId: formattedMessage.channelId,
                  readedMessageId: formattedMessage.id,
                  serverId: formattedMessage.serverId!,
                  isTagged: formattedMessage.isTagged!,
                }),
              );
            }
          }
        }

        if (data.MessageType === 'New message in sub channel') {
          const formattedMessage = formatMessage(data.Payload);

          if (formattedMessage.id) {
            dispatch(addSubChatMessage(formattedMessage));
          }
        }

        if (data.MessageType === 'New message in chat') {
          const formattedMessage = formatChatMessage(data.Payload);

          if (formattedMessage.id) {
            dispatch(addChatMessage(formattedMessage));

            if (formattedMessage.authorId !== user.id) {
              dispatch(
                changeChatReadedCount({
                  readChatId: formattedMessage.channelId,
                  readedMessageId: formattedMessage.id,
                  isTagged: formattedMessage.isTagged!,
                }),
              );
            } else {
              dispatch(
                readOwnChatMessage({
                  readChatId: formattedMessage.channelId,
                  readedMessageId: formattedMessage.id,
                }),
              );
            }
          }
        }

        if (
          data.MessageType === 'Deleted message in text channel' ||
          data.MessageType === 'Deleted message in notification channel'
        ) {
          dispatch(
            deleteMessageWs({
              channelId: data.Payload.ChannelId,
              messageId: data.Payload.MessageId,
            }),
          );
        }

        if (data.MessageType === 'Deleted message in sub channel') {
          dispatch(
            deleteSubChatMessageWS({
              channelId: data.Payload.ChannelId,
              messageId: data.Payload.MessageId,
            }),
          );
        }

        if (data.MessageType === 'Deleted message in chat') {
          dispatch(
            deleteChatMessageWS({
              chatId: data.Payload.ChatId,
              messageId: data.Payload.MessageId,
            }),
          );
        }

        if (
          data.MessageType === 'Updated message in text channel' ||
          data.MessageType === 'Updated message in notification channel'
        ) {
          const formattedMessage = formatMessage(data.Payload);
          dispatch(editMessageWs(formattedMessage));
        }

        if (data.MessageType === 'Updated message in chat') {
          const formattedMessage = formatChatMessage(data.Payload);
          dispatch(editChatMessageWS(formattedMessage));
        }

        if (data.MessageType === 'Updated message in sub channel') {
          const formattedMessage = formatMessage(data.Payload);
          dispatch(editSubChatMessageWS(formattedMessage));
        }

        if (data.MessageType === 'User notified') {
          play();

          const activeChannelId =
            currentChannelIdValue ?? currentNotificationChannelIdValue;

          showMessage(
            formatNotification(data.Payload),
            notificationLifeTimeValue,
            activeChannelId,
          );
        }

        if (data.MessageType === 'User notified in chat') {
          play();

          showMessage(
            formatNotification(data.Payload),
            notificationLifeTimeValue,
            currentChatIdValue,
            true,
          );
        }

        if (data.MessageType === 'ErrorWithMessage') {
          const message = `${data.Payload.Object}: ${data.Payload.Message}`;
          showError(message);
        }

        if (data.MessageType === 'Role added to user') {
          const { ServerId, UserId, RoleId } = data.Payload;

          if (UserId === userIdValue) {
            dispatch(getServerData({ serverId: ServerId }));
          } else {
            dispatch(
              addRoleToUserWs({
                serverId: ServerId,
                userId: UserId,
                roleId: RoleId,
              }),
            );
          }
        }

        if (data.MessageType === 'Role removed from user') {
          const { ServerId, UserId, RoleId } = data.Payload;

          if (UserId === userIdValue) {
            dispatch(getServerData({ serverId: ServerId }));
          } else {
            dispatch(
              removeRoleFromUserWs({
                serverId: ServerId,
                userId: UserId,
                roleId: RoleId,
              }),
            );
          }
        }

        if (data.MessageType === 'New user in chat') {
          dispatch(
            addUserInChatWs({
              chatId: data.Payload.ChatId,
              userId: data.Payload.UserId,
              userName: data.Payload.UserName,
              userTag: data.Payload.UserTag,
              icon: data.Payload.Icon
                ? formatMessageFile(data.Payload.Icon)
                : null,
              notifiable: data.Payload.Notifiable,
              friendshipApplication: data.Payload.FriendshipApplication,
              nonFriendMessage: data.Payload.NonFriendMessage,
              isFriend: data.Payload.IsFriend,
              systemRoles: data.Payload.SystemRoles.map(formatSystemRoles),
            }),
          );
        }

        if (data.MessageType === 'You have been added into a chat') {
          dispatch(
            addChat({
              chatId: data.Payload.ChatId,
              chatName: data.Payload.ChatName,
              nonReadedCount: data.Payload.NonReadedCount,
              nonReadedTaggedCount: data.Payload.NonReadedTaggedCount,
              lastReadedMessageId: data.Payload.LastReadedMessageId,
              icon: data.Payload.Icon
                ? formatMessageFile(data.Payload.Icon)
                : null,
            }),
          );
        }

        if (data.MessageType === 'New icon on chat') {
          dispatch(
            updateChatIcon({
              chatId: data.Payload.ChatId,
              icon: formatMessageFile(data.Payload.Icon),
            }),
          );
        }

        if (data.MessageType === 'New icon on server') {
          dispatch(
            updateServerIcon({
              serverId: data.Payload.ServerId,
              icon: formatMessageFile(data.Payload.Icon),
            }),
          );
        }

        if (
          data.MessageType === 'User voted in text channel' ||
          data.MessageType === 'User unvoted in text channel' ||
          data.MessageType === 'User voted in notification channel' ||
          data.MessageType === 'User unvoted in notification channel'
        ) {
          const formattedMessage = formatMessage(data.Payload);

          //console.log(formattedMessage);
          dispatch(updateVoteWs(formattedMessage));
        }

        if (
          data.MessageType === 'User voted in sub channel' ||
          data.MessageType === 'User unvoted in sub channel'
        ) {
          const formattedMessage = formatMessage(data.Payload);

          dispatch(updateSubChatVoteWs(formattedMessage));
        }

        if (
          data.MessageType === 'User voted in chat' ||
          data.MessageType === 'User unvoted in chat'
        ) {
          const formattedMessage = formatChatMessage(data.Payload);

          dispatch(updateChatVoteWs(formattedMessage));
        }

        if (data.MessageType === 'New friendship application') {
          const formattedApplication = formatApplication(data.Payload);
          notifications.show({
            title: 'Уведомление',
            message: `Вам пришло предложение о дружбе от пользователя ${formattedApplication.user.userName}`,
            position: 'top-center',
            color: 'yellow',
            radius: 'md',
            autoClose: 4000,
            icon: <CircleAlert />,
          });
          dispatch(addApplicationTo(formattedApplication));
        }

        if (data.MessageType === 'Created friendship application') {
          const formattedApplication = formatApplication(data.Payload);
          dispatch(addApplicationFrom(formattedApplication));
        }

        if (data.MessageType === 'Friendship application declined') {
          dispatch(removeApplicationFrom(data.Payload.Id));
        }

        if (data.MessageType === 'Friendship application deleted') {
          dispatch(removeApplicationTo(data.Payload.Id));
        }

        if (data.MessageType === 'Friendship application approved') {
          const formattedApplication = formatApplication(data.Payload);

          dispatch(approveApplicationFrom(formattedApplication));
        }

        if (data.MessageType === 'You approved application') {
          const formattedApplication = formatApplication(data.Payload);
          dispatch(approveApplicationTo(formattedApplication));
        }

        if (data.MessageType === 'Friendship deleted') {
          dispatch(removeFriend(data.Payload.UserId));
        }

        if (data.MessageType === 'User mute status is changed') {
          const { ServerId, ChannelId, UserId, MuteStatus } = data.Payload;

          if (currentServerIdValue === ServerId) {
            dispatch(
              changeUserMuteStatusWs({
                channelId: ChannelId,
                userId: UserId,
                muteStatus: Number(MuteStatus),
              }),
            );

            if (UserId === userIdValue) {
              setIsUserMute(Number(MuteStatus) === 2);
            }
          }
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current = ws;

      return () => {
        //console.log('Closing WebSocket connection');
        ws.close();
      };
    }
  }, [accessToken, dispatch]);

  const sendMessage = useCallback(
    (message: CreateMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'New message',
          Content: message,
        };

        //console.log(sendData);
        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  const sendChatMessage = useCallback(
    (message: CreateMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'New message chat',
          Content: message,
        };

        //console.log(sendData);

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  const editMessage = useCallback(
    (message: EditMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'Update message',
          Content: message,
        };

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  const editChatMessage = useCallback(
    (message: EditMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'Update message chat',
          Content: message,
        };

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  const deleteMessage = useCallback(
    (message: DeleteMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'Delete message',
          Content: message,
        };

        //console.log(sendData);

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  const deleteChatMessage = useCallback(
    (message: DeleteMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'Delete message chat',
          Content: message,
        };

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  const readMessage = useCallback(
    (message: ReadMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'See message',
          Content: message,
        };

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  const vote = useCallback(
    (voteData: Vote) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'Vote',
          Content: voteData,
        };

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  const unVote = useCallback(
    (voteData: Vote) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'Unvote',
          Content: voteData,
        };

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  return (
    <WebSocketContext.Provider
      value={{
        sendMessage,
        sendChatMessage,
        editMessage,
        editChatMessage,
        deleteMessage,
        deleteChatMessage,
        readMessage,
        vote,
        unVote,
      }}
    >
      {props.children}
    </WebSocketContext.Provider>
  );
};
