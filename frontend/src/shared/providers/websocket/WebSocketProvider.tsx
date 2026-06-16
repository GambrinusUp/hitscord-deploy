import { notifications } from '@mantine/notifications';
import * as signalR from '@microsoft/signalr';
import { CircleAlert } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSound } from 'use-sound';

import { WebSocketContext } from './WebSocketContext';

import { useMediaContext } from '~/context';
import {
  addChat,
  addChatMessage,
  addReactionChatWs,
  addUserInChatWs,
  changeChatReadedCount,
  deleteChatMessageWS,
  editChatMessageWS,
  readOwnChatMessage,
  removeReactionChatWs,
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
import { AddReaction, RemoveReaction } from '~/entities/reactions';
import {
  addReactionSubWs,
  addSubChatMessage,
  deleteSubChatMessageWS,
  editSubChatMessageWS,
  removeReactionSubWs,
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
import { useAudioSettings } from '~/shared/lib/hooks';
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
  addReactionWs,
  removeReactionWs,
} from '~/store/ServerStore';

const SIGNALR_HUB_URL =
  import.meta.env.VITE_SIGNALR_URL ||
  `${(import.meta.env.VITE_BASE_URL || '').replace(/\/api\/?$/, '')}/api/wss`;

const SIGNALR_EVENTS = [
  'New user on server',
  'User unsubscribe',
  'Role changed',
  'New channel',
  'Channel deleted',
  'New server name',
  'New users name on server',
  'You removed from server',
  'Server deleted',
  'Change channel name',
  'New user in voice channel',
  'User remove from voice channel',
  'User change his mute status',
  'New role',
  'Updated role settings',
  'Voice channel settings edited',
  'Text channel settings edited',
  'Sub channel settings edited',
  'Notification channel settings edited',
  'New message in text channel',
  'New message in notification channel',
  'New message in sub channel',
  'New message in chat',
  'Deleted message in text channel',
  'Deleted message in notification channel',
  'Deleted message in sub channel',
  'Deleted message in chat',
  'Updated message in text channel',
  'Updated message in notification channel',
  'Updated message in chat',
  'Updated message in sub channel',
  'User notified',
  'User notified in chat',
  'Error',
  'ErrorWithMessage',
  'Role added to user',
  'Role removed from user',
  'New user in chat',
  'You have been added into a chat',
  'New icon on chat',
  'New icon on server',
  'User voted in text channel',
  'User unvoted in text channel',
  'User voted in notification channel',
  'User unvoted in notification channel',
  'User voted in sub channel',
  'User unvoted in sub channel',
  'User voted in chat',
  'User unvoted in chat',
  'New friendship application',
  'Created friendship application',
  'Friendship application declined',
  'Friendship application deleted',
  'Friendship application approved',
  'You approved application',
  'Friendship deleted',
  'User mute status is changed',
  'Added reaction in text channel',
  'Added reaction in notification channel',
  'Added reaction in sub channel',
  'Added reaction in chat',
  'Removed reaction in text channel',
  'Removed reaction in notification channel',
  'Removed reaction in sub channel',
  'Removed reaction in chat',
] as const;

const removeToken = <T extends { Token?: string }>(payload: T) => {
  const { Token: _token, ...data } = payload;

  return data;
};

const toPascalCasePayload = (payload: unknown): unknown => {
  if (Array.isArray(payload)) {
    return payload.map(toPascalCasePayload);
  }

  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key.charAt(0).toUpperCase() + key.slice(1),
      toPascalCasePayload(value),
    ]),
  );
};

export const WebSocketProvider = (props: React.PropsWithChildren) => {
  const { volume } = useAudioSettings();
  const [play] = useSound(sound, { volume });
  const dispatch = useAppDispatch();
  const disconnect = useDisconnect();
  const { showMessage, showError } = useNotification();
  const { accessToken, isLoggedIn, user } = useAppSelector(
    (state) => state.userStore,
  );
  const {
    currentServerId,
    currentVoiceChannelId,
    serverData,
    currentChannelId,
    currentNotificationChannelId,
  } = useAppSelector((state) => state.testServerStore);
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const { currentSubChatId } = useAppSelector((state) => state.subChatStore);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [connectionStarted, setConnectionStarted] = useState(false);
  const { setIsUserMute } = useMediaContext();

  const serverIdRef = useRef<string | null>(null);
  const userIdRef = useRef<string | undefined>(undefined);
  const userRolesIds = useRef<UserRoleOnServer[]>([]);
  const currentVoiceChannelIdRef = useRef(currentVoiceChannelId);
  const notificationLifeTimeRef = useRef(0);
  const currentChannelIdRef = useRef<string | null>(null);
  const currentNotificationChannelIdRef = useRef<string | null>(null);
  const currentChatIdRef = useRef<string | null>(null);
  const currentSubChatIdRef = useRef<string | null>(null);

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
    currentSubChatIdRef.current = currentSubChatId;
  }, [currentSubChatId]);

  useEffect(() => {
    if (isLoggedIn) {
      console.log(SIGNALR_HUB_URL);
      
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(SIGNALR_HUB_URL, {
          accessTokenFactory: () => accessToken,
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Warning)
        .build();

      // SignalR events reuse the legacy dynamic payload shape from the old websocket.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleMessage = (messageType: string, payload: any) => {
        const data = {
          MessageType: messageType,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Payload: toPascalCasePayload(payload) as any,
        };

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

        if (data.MessageType === 'Error') {
          const message =
            data.Payload?.MessageFront ||
            data.Payload?.Message ||
            'SignalR error';

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

        if (
          data.MessageType === 'Added reaction in text channel' ||
          data.MessageType === 'Added reaction in notification channel'
        ) {
          const {
            Id,
            ServerId,
            ChannelId,
            MessageId,
            AuthorId,
            CreatedAt,
            ReactionCode,
          } = data.Payload;

          if (currentServerIdValue === ServerId) {
            dispatch(
              addReactionWs({
                id: Id,
                serverId: ServerId,
                channelId: ChannelId,
                messageId: MessageId,
                authorId: AuthorId,
                createdAt: CreatedAt,
                reactionCode: ReactionCode,
              }),
            );
          }
        }

        if (data.MessageType === 'Added reaction in sub channel') {
          const {
            Id,
            ServerId,
            ChannelId,
            MessageId,
            AuthorId,
            CreatedAt,
            ReactionCode,
          } = data.Payload;

          if (currentServerIdValue === ServerId) {
            dispatch(
              addReactionSubWs({
                id: Id,
                serverId: ServerId,
                channelId: ChannelId,
                messageId: MessageId,
                authorId: AuthorId,
                createdAt: CreatedAt,
                reactionCode: ReactionCode,
              }),
            );
          }
        }

        if (data.MessageType === 'Added reaction in chat') {
          const { Id, ChatId, MessageId, AuthorId, CreatedAt, ReactionCode } =
            data.Payload;

          dispatch(
            addReactionChatWs({
              id: Id,
              chatId: ChatId,
              messageId: MessageId,
              authorId: AuthorId,
              createdAt: CreatedAt,
              reactionCode: ReactionCode,
            }),
          );
        }

        if (
          data.MessageType === 'Removed reaction in text channel' ||
          data.MessageType === 'Removed reaction in notification channel'
        ) {
          const {
            Id,
            ServerId,
            ChannelId,
            MessageId,
            AuthorId,
            CreatedAt,
            ReactionCode,
          } = data.Payload;

          if (currentServerIdValue === ServerId) {
            dispatch(
              removeReactionWs({
                id: Id,
                serverId: ServerId,
                channelId: ChannelId,
                messageId: MessageId,
                authorId: AuthorId,
                createdAt: CreatedAt,
                reactionCode: ReactionCode,
              }),
            );
          }
        }

        if (data.MessageType === 'Removed reaction in sub channel') {
          const {
            Id,
            ServerId,
            ChannelId,
            MessageId,
            AuthorId,
            CreatedAt,
            ReactionCode,
          } = data.Payload;

          if (currentServerIdValue === ServerId) {
            dispatch(
              removeReactionSubWs({
                id: Id,
                serverId: ServerId,
                channelId: ChannelId,
                messageId: MessageId,
                authorId: AuthorId,
                createdAt: CreatedAt,
                reactionCode: ReactionCode,
              }),
            );
          }
        }

        if (data.MessageType === 'Removed reaction in chat') {
          const { Id, ChatId, MessageId, AuthorId, CreatedAt, ReactionCode } =
            data.Payload;

          dispatch(
            removeReactionChatWs({
              id: Id,
              chatId: ChatId,
              messageId: MessageId,
              authorId: AuthorId,
              createdAt: CreatedAt,
              reactionCode: ReactionCode,
            }),
          );
        }
      };

      SIGNALR_EVENTS.forEach((eventName) => {
        connection.on(eventName, (payload) => handleMessage(eventName, payload));
      });

      connection.onreconnected(() => {
        setConnectionStarted(true);
      });

      connection.onreconnecting(() => {
        setConnectionStarted(false);
      });

      connection.onclose((error) => {
        setConnectionStarted(false);

        if (error) {
          console.error('SignalR connection closed:', error);
        }
      });

      connectionRef.current = connection;

      connection
        .start()
        .then(() => setConnectionStarted(true))
        .catch((error) => {
          console.error('SignalR connection error:', error);
        });

      return () => {
        setConnectionStarted(false);
        connectionRef.current = null;
        void connection.stop();
      };
    }
  }, [accessToken, dispatch, isLoggedIn]);

  const invokeHub = useCallback((methodName: string, ...args: unknown[]) => {
    const connection = connectionRef.current;

    if (connection?.state === signalR.HubConnectionState.Connected) {
      void connection.invoke(methodName, ...args).catch((error) => {
        console.error(`SignalR ${methodName} error:`, error);
      });

      return;
    }

    console.error('SignalR connection is not connected:', connection?.state);
  }, []);

  useEffect(() => {
    if (!connectionStarted || !currentServerId) {
      return;
    }

    invokeHub('JoinServer', currentServerId);

    return () => {
      invokeHub('LeaveServer', currentServerId);
    };
  }, [connectionStarted, currentServerId, invokeHub]);

  useEffect(() => {
    const channelId = currentChannelId ?? currentNotificationChannelId;

    if (!connectionStarted || !channelId) {
      return;
    }

    invokeHub('JoinChannel', channelId);

    return () => {
      invokeHub('LeaveChannel', channelId);
    };
  }, [
    connectionStarted,
    currentChannelId,
    currentNotificationChannelId,
    invokeHub,
  ]);

  useEffect(() => {
    if (!connectionStarted || !currentSubChatId) {
      return;
    }

    invokeHub('JoinChannel', currentSubChatId);

    return () => {
      invokeHub('LeaveChannel', currentSubChatId);
    };
  }, [connectionStarted, currentSubChatId, invokeHub]);

  useEffect(() => {
    if (!connectionStarted || !activeChat) {
      return;
    }

    invokeHub('JoinChat', activeChat);

    return () => {
      invokeHub('LeaveChat', activeChat);
    };
  }, [activeChat, connectionStarted, invokeHub]);

  const sendMessage = useCallback(
    (message: CreateMessageWs) => {
      invokeHub('SendMessageChannel', removeToken(message));
    },
    [invokeHub],
  );

  const sendChatMessage = useCallback(
    (message: CreateMessageWs) => {
      invokeHub('SendMessageChat', removeToken(message));
    },
    [invokeHub],
  );

  const editMessage = useCallback(
    (message: EditMessageWs) => {
      invokeHub('UpdateMessageChannel', removeToken(message));
    },
    [invokeHub],
  );

  const editChatMessage = useCallback(
    (message: EditMessageWs) => {
      invokeHub('UpdateMessageChat', removeToken(message));
    },
    [invokeHub],
  );

  const deleteMessage = useCallback(
    (message: DeleteMessageWs) => {
      invokeHub('DeleteMessageChannel', removeToken(message));
    },
    [invokeHub],
  );

  const deleteChatMessage = useCallback(
    (message: DeleteMessageWs) => {
      invokeHub('DeleteMessageChat', removeToken(message));
    },
    [invokeHub],
  );

  const readMessage = useCallback(
    (message: ReadMessageWs) => {
      invokeHub('SeeMessage', removeToken(message));
    },
    [invokeHub],
  );

  const vote = useCallback(
    (voteData: Vote) => {
      invokeHub('Vote', removeToken(voteData));
    },
    [invokeHub],
  );

  const unVote = useCallback(
    (voteData: Vote) => {
      invokeHub('Unvote', removeToken(voteData));
    },
    [invokeHub],
  );

  const addReaction = useCallback(
    (reaction: AddReaction, type: 'channel' | 'chat') => {
      invokeHub(
        type === 'channel' ? 'AddReactionChannel' : 'AddReactionChat',
        removeToken(reaction),
      );
    },
    [invokeHub],
  );

  const removeReaction = useCallback(
    (reaction: RemoveReaction, type: 'channel' | 'chat') => {
      invokeHub(
        type === 'channel' ? 'RemoveReactionChannel' : 'RemoveReactionChat',
        removeToken(reaction),
      );
    },
    [invokeHub],
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
        addReaction,
        removeReaction,
      }}
    >
      {props.children}
    </WebSocketContext.Provider>
  );
};
