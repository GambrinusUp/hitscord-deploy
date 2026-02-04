import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';

import {
  addRole,
  changeChannelName,
  changeChannelNotifiable,
  changeNameOnServer,
  changeNotifiable,
  changeNotificationChannelSettings,
  changeRole,
  changeServerIcon,
  changeServerIsClosed,
  changeServerName,
  changeSubChannelSettings,
  changeTextChannelSettings,
  changeVoiceChannelMaxCount,
  changeVoiceChannelSettings,
  createChannel,
  createInvitation,
  createServer,
  deleteChannel,
  deleteServer,
  deleteUserFromServer,
  getBannedUsers,
  getChannelMessages,
  getChannelSettings,
  getMoreMessages,
  getServerData,
  getUserServers,
  removeRole,
  selfMute,
  subscribeToServer,
  unbanUser,
  unsubscribeFromServer,
} from './ServerStore.actions';
import {
  BannedUserResponse,
  ChangeReadedCount,
  ChannelMessage,
  GetChannelSettings,
  MuteStatus,
  ReadedMessageWs,
  ServerData,
  ServerItem,
  ServerState,
  UserOnServer,
} from './ServerStore.types';

import { MAX_MESSAGE_NUMBER } from '~/constants';
import { FileResponse } from '~/entities/files';
import { ServerTypeEnum } from '~/entities/servers';
import { LoadingState } from '~/shared';
import { UpdateRole } from '~/store/RolesStore/RolesStore.types';

const initialState: ServerState = {
  serversList: [],
  serverData: {
    serverId: '',
    serverName: '',
    serverType: ServerTypeEnum.Student,
    icon: null,
    isClosed: false,
    roles: [],
    userRoles: [],
    users: [],
    channels: {
      textChannels: [],
      voiceChannels: [],
      notificationChannels: [],
    },
    isCreator: false,
    permissions: {
      canChangeRole: false,
      canWorkChannels: false,
      canDeleteUsers: false,
      canMuteOther: false,
      canDeleteOthersMessages: false,
      canIgnoreMaxCount: false,
      canCreateRoles: false,
      canUseInvitations: false,
    },
    isNotifiable: false,
    invitationString: null,
  },
  currentServerId: null,
  currentChannelId: null,
  currentNotificationChannelId: null,
  currentVoiceChannelId: null,
  currentVoiceChannelName: null,
  currentVoiceChannelServerId: null,
  messages: [],
  hasNewMessage: false,
  messagesStatus: LoadingState.IDLE,
  roleSettings: {
    canSee: null,
    canJoin: null,
    canWrite: null,
    canWriteSub: null,
    canUse: null,
    notificated: null,
  },
  bannedUsers: [],
  pageBannedUsers: 1,
  totalPagesBannedUsers: 1,
  isLoading: false,
  numberOfMessages: MAX_MESSAGE_NUMBER,
  startMessageId: 0,
  remainingTopMessagesCount: 0,
  lastTopMessageId: 0,
  remainingBottomMessagesCount: MAX_MESSAGE_NUMBER,
  lastBottomMessageId: 0,
  allMessagesCount: 0,
  messageIsLoading: LoadingState.IDLE,
  error: '',
};

const testServerSlice = createSlice({
  name: 'testServer',
  initialState,
  reducers: {
    setCurrentServerId: (state, action: PayloadAction<string>) => {
      state.currentServerId = action.payload;
      state.serverData.permissions = {
        canChangeRole: false,
        canWorkChannels: false,
        canDeleteUsers: false,
        canMuteOther: false,
        canDeleteOthersMessages: false,
        canIgnoreMaxCount: false,
        canCreateRoles: false,
        canUseInvitations: false,
      };
      state.error = '';
    },
    setCurrentChannelId: (state, action: PayloadAction<string | null>) => {
      const channelId = action.payload;

      if (state.currentChannelId === channelId) {
        return;
      }

      state.currentChannelId = channelId;
      state.currentNotificationChannelId = null;

      if (channelId) {
        const textChannel = state.serverData.channels.textChannels.find(
          (channel) => channel.channelId === channelId,
        );

        if (textChannel) {
          state.startMessageId = textChannel.lastReadedMessageId;
        }
      }

      state.numberOfMessages = 0;
      state.remainingTopMessagesCount = 0;
      state.lastTopMessageId = 0;
      state.allMessagesCount = 0;
      state.remainingBottomMessagesCount = MAX_MESSAGE_NUMBER;
      state.lastBottomMessageId = 0;
      state.messages = [];
    },
    setCurrentNotificationChannelId: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      const channelId = action.payload;

      if (state.currentNotificationChannelId === channelId) {
        return;
      }
      state.currentNotificationChannelId = channelId;

      state.currentChannelId = null;

      if (channelId) {
        const notifChannel =
          state.serverData.channels.notificationChannels.find(
            (channel) => channel.channelId === channelId,
          );

        if (notifChannel) {
          state.startMessageId = notifChannel.lastReadedMessageId;
        }
      }

      state.numberOfMessages = 0;
      state.remainingTopMessagesCount = 0;
      state.lastTopMessageId = 0;
      state.allMessagesCount = 0;
      state.remainingBottomMessagesCount = MAX_MESSAGE_NUMBER;
      state.lastBottomMessageId = 0;
      state.messages = [];
    },
    setCurrentVoiceChannelId: (state, action: PayloadAction<string | null>) => {
      state.currentVoiceChannelId = action.payload;
    },
    setCurrentVoiceChannelName: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      const voiceChannel = state.serverData.channels.voiceChannels.find(
        (channel) => channel.channelId === action.payload,
      );

      if (voiceChannel) {
        state.currentVoiceChannelName = voiceChannel.channelName;
      }
    },
    setCurrentVoiceChannelServerId: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      state.currentVoiceChannelServerId = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChannelMessage>) => {
      const { channelId } = action.payload;

      if (
        channelId === state.currentChannelId ||
        channelId === state.currentNotificationChannelId
      ) {
        if (state.remainingBottomMessagesCount <= 0) {
          state.messages.push(action.payload);
        }
      }
    },
    deleteMessageWs: (
      state,
      action: PayloadAction<{ channelId: string; messageId: number }>,
    ) => {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload.messageId,
      );
    },
    editMessageWs: (state, action: PayloadAction<ChannelMessage>) => {
      const index = state.messages.findIndex(
        (message) => message.id === action.payload.id,
      );

      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    // Проверку на добавление на конкретном сервере
    addUserWs: (state, action: PayloadAction<UserOnServer>) => {
      //console.log(state.currentServerId);
      //console.log(state.serverData.users);
      state.serverData.users.push(action.payload);
    },
    deleteUserWs: (
      state,
      action: PayloadAction<{ UserId: string; ServerId: string }>,
    ) => {
      if (action.payload.ServerId === state.currentServerId) {
        state.serverData.users = state.serverData.users.filter(
          (user) => user.userId !== action.payload.UserId,
        );
      }
    },
    clearServerData: (state) => {
      state.serversList = [];
      state.messages = [];
      state.currentServerId = null;
      state.currentNotificationChannelId = null;
      state.currentVoiceChannelId = null;
      state.currentServerId = null;
      state.currentChannelId = null;
      state.serverData = {
        serverId: '',
        serverName: '',
        serverType: ServerTypeEnum.Student,
        icon: null,
        isClosed: false,
        roles: [],
        userRoles: [],
        users: [],
        channels: {
          textChannels: [],
          voiceChannels: [],
          notificationChannels: [],
        },
        isCreator: false,
        permissions: {
          canChangeRole: false,
          canWorkChannels: false,
          canDeleteUsers: false,
          canMuteOther: false,
          canDeleteOthersMessages: false,
          canIgnoreMaxCount: false,
          canCreateRoles: false,
          canUseInvitations: false,
        },
        isNotifiable: false,
        invitationString: null,
      };
      state.roleSettings = {
        canSee: null,
        canJoin: null,
        canWrite: null,
        canWriteSub: null,
        canUse: null,
        notificated: null,
      };
      state.numberOfMessages = 0;
      state.startMessageId = 0;
      state.remainingTopMessagesCount = 0;
      state.lastTopMessageId = 0;
      state.allMessagesCount = 0;
      state.remainingBottomMessagesCount = MAX_MESSAGE_NUMBER;
      state.lastBottomMessageId = 0;
    },
    clearHasNewMessage: (state) => {
      state.hasNewMessage = false;
    },
    setNewServerName: (state, action: PayloadAction<{ name: string }>) => {
      state.serverData.serverName = action.payload.name;
    },
    setNewUserName: (
      state,
      action: PayloadAction<{ userId: string; name: string }>,
    ) => {
      const userIndex = state.serverData.users.findIndex(
        (user) => user.userId === action.payload.userId,
      );

      if (userIndex !== -1) {
        state.serverData.users[userIndex].userName = action.payload.name;
      }
    },
    removeUser: (state, action: PayloadAction<{ userId: string }>) => {
      const userIndex = state.serverData.users.findIndex(
        (user) => user.userId === action.payload.userId,
      );

      if (userIndex !== -1) {
        state.serverData.users.splice(userIndex, 1);
      }
    },
    removeServer: (state, action: PayloadAction<{ serverId: string }>) => {
      const serverIndex = state.serversList.findIndex(
        (server) => server.serverId === action.payload.serverId,
      );

      if (serverIndex !== -1) {
        state.serversList.splice(serverIndex, 1);
      }
    },
    editChannelName: (
      state,
      action: PayloadAction<{ channelId: string; newName: string }>,
    ) => {
      const { channelId, newName } = action.payload;

      const textChannel = state.serverData.channels.textChannels.find(
        (channel) => channel.channelId === channelId,
      );

      if (textChannel) {
        textChannel.channelName = newName;

        return;
      }

      const voiceChannel = state.serverData.channels.voiceChannels.find(
        (channel) => channel.channelId === channelId,
      );

      if (voiceChannel) {
        voiceChannel.channelName = newName;

        return;
      }
    },
    addUserOnVoiceChannel: (
      state,
      action: PayloadAction<{
        channelId: string;
        userId: string;
        muteStatus: MuteStatus;
      }>,
    ) => {
      const { channelId, userId, muteStatus } = action.payload;

      const voiceChannel = state.serverData.channels.voiceChannels.find(
        (channel) => channel.channelId === channelId,
      );

      console.log(userId, muteStatus);

      if (voiceChannel) {
        if (!voiceChannel.users.some((user) => user.userId === userId)) {
          voiceChannel.users.push({
            userId,
            muteStatus: muteStatus,
          });
        }
      }
    },
    removeUserFromVoiceChannel: (
      state,
      action: PayloadAction<{ channelId: string; userId: string }>,
    ) => {
      const { channelId, userId } = action.payload;

      const voiceChannel = state.serverData.channels.voiceChannels.find(
        (channel) => channel.channelId === channelId,
      );

      if (voiceChannel) {
        voiceChannel.users = voiceChannel.users.filter(
          (user) => user.userId !== userId,
        );
      }
    },
    toggleUserMuteStatus: (
      state,
      action: PayloadAction<{
        channelId: string;
        userId: string;
        isMuted: boolean;
      }>,
    ) => {
      const { channelId, userId, isMuted } = action.payload;

      const voiceChannel = state.serverData.channels.voiceChannels.find(
        (channel) => channel.channelId === channelId,
      );

      if (voiceChannel) {
        voiceChannel.users = voiceChannel.users.map((user) =>
          user.userId === userId ? { ...user, isMuted } : user,
        );
      }
    },
    updatedRole: (state, action: PayloadAction<UpdateRole>) => {
      const { roleId, name, color } = action.payload;

      const roleIndex = state.serverData.roles.findIndex(
        (role) => role.id === roleId,
      );

      if (roleIndex !== -1) {
        state.serverData.roles[roleIndex] = {
          ...state.serverData.roles[roleIndex],
          name: name,
          color: color,
        };
      }

      state.serverData.users = state.serverData.users.map((user) => {
        user.roles = user.roles.map((role) => {
          if (role.roleId === roleId) {
            return { ...role, roleName: name };
          }

          return role;
        });

        return user;
      });
    },
    readMessageWs: (state, action: PayloadAction<ReadedMessageWs>) => {
      const { readChannelId, readedMessageId, serverId, isTagged } =
        action.payload;

      const indexTextChannel = state.serverData.channels.textChannels.findIndex(
        (channel) => channel.channelId === readChannelId,
      );

      if (indexTextChannel >= 0) {
        state.serverData.channels.textChannels[
          indexTextChannel
        ].nonReadedCount -= 1;

        if (isTagged) {
          state.serverData.channels.textChannels[
            indexTextChannel
          ].nonReadedTaggedCount -= 1;
        }

        state.serverData.channels.textChannels[
          indexTextChannel
        ].lastReadedMessageId = readedMessageId;
      }

      const indexNotificationChannel =
        state.serverData.channels.notificationChannels?.findIndex(
          (channel) => channel.channelId === readChannelId,
        );

      if (indexNotificationChannel >= 0) {
        state.serverData.channels.notificationChannels[
          indexNotificationChannel
        ].nonReadedCount -= 1;

        if (isTagged) {
          state.serverData.channels.notificationChannels[
            indexTextChannel
          ].nonReadedTaggedCount -= 1;
        }

        state.serverData.channels.notificationChannels[
          indexNotificationChannel
        ].lastReadedMessageId = readedMessageId;
      }

      const indexServer = state.serversList.findIndex(
        (server) => server.serverId === serverId,
      );

      if (indexServer >= 0) {
        state.serversList[indexServer].nonReadedCount -= 1;

        if (isTagged) {
          state.serversList[indexServer].nonReadedTaggedCount -= 1;
        }
      }
    },
    changeReadedCount: (state, action: PayloadAction<ChangeReadedCount>) => {
      const { channelId, serverId, isTagged } = action.payload;

      const indexTextChannel = state.serverData.channels.textChannels.findIndex(
        (channel) => channel.channelId === channelId,
      );

      if (indexTextChannel >= 0) {
        state.serverData.channels.textChannels[
          indexTextChannel
        ].nonReadedCount += 1;

        if (isTagged) {
          state.serverData.channels.textChannels[
            indexTextChannel
          ].nonReadedTaggedCount += 1;
        }
      }

      const indexNotificationChannel =
        state.serverData.channels.notificationChannels?.findIndex(
          (channel) => channel.channelId === channelId,
        );

      if (indexNotificationChannel >= 0) {
        state.serverData.channels.notificationChannels[
          indexNotificationChannel
        ].nonReadedCount += 1;

        if (isTagged) {
          state.serverData.channels.notificationChannels[
            indexTextChannel
          ].nonReadedTaggedCount += 1;
        }
      }

      const indexServer = state.serversList.findIndex(
        (server) => server.serverId === serverId,
      );

      if (indexServer >= 0) {
        state.serversList[indexServer].nonReadedCount += 1;

        if (isTagged) {
          state.serversList[indexServer].nonReadedTaggedCount += 1;
        }
      }
    },
    readOwnMessage: (state, action: PayloadAction<ChangeReadedCount>) => {
      const { channelId, readedMessageId } = action.payload;

      const indexTextChannel = state.serverData.channels.textChannels.findIndex(
        (channel) => channel.channelId === channelId,
      );

      if (indexTextChannel >= 0) {
        state.serverData.channels.textChannels[
          indexTextChannel
        ].lastReadedMessageId = readedMessageId;
      }

      const indexNotificationChannel =
        state.serverData.channels.notificationChannels?.findIndex(
          (channel) => channel.channelId === channelId,
        );

      if (indexNotificationChannel >= 0) {
        state.serverData.channels.notificationChannels[
          indexNotificationChannel
        ].lastReadedMessageId = readedMessageId;
      }
    },
    addRoleToUserWs: (
      state,
      action: PayloadAction<{
        serverId: string;
        userId: string;
        roleId: string;
      }>,
    ) => {
      const { userId, roleId, serverId } = action.payload;

      if (state.currentServerId !== serverId) {
        return;
      }

      const findedRole = state.serverData.roles.find(
        (role) => role.id === roleId,
      );

      if (findedRole) {
        const userIndex = state.serverData.users.findIndex(
          (user) => user.userId === userId,
        );

        if (userIndex >= 0) {
          state.serverData.users[userIndex].roles = [
            ...state.serverData.users[userIndex].roles,
            {
              roleId: findedRole.id,
              roleName: findedRole.name,
              roleType: findedRole.type,
            },
          ];
        }
      }
    },
    removeRoleFromUserWs: (
      state,
      action: PayloadAction<{
        serverId: string;
        userId: string;
        roleId: string;
      }>,
    ) => {
      const { userId, roleId, serverId } = action.payload;

      if (state.currentServerId !== serverId) {
        return;
      }

      const findedRole = state.serverData.roles.find(
        (role) => role.id === roleId,
      );

      if (findedRole) {
        const userIndex = state.serverData.users.findIndex(
          (user) => user.userId === userId,
        );

        if (userIndex >= 0) {
          state.serverData.users[userIndex].roles = state.serverData.users[
            userIndex
          ].roles.filter((role) => role.roleId !== roleId);
        }
      }
    },
    updateVoteWs: (state, action: PayloadAction<ChannelMessage>) => {
      const index = state.messages.findIndex(
        (message) => message.id === action.payload.id,
      );

      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    updateServerIcon: (
      state,
      action: PayloadAction<{
        serverId: string;
        icon: FileResponse;
      }>,
    ) => {
      const { serverId, icon } = action.payload;

      if (state.currentServerId === serverId) {
        state.serverData.icon = icon;
      }

      state.serversList = state.serversList.map((server) =>
        server.serverId === serverId ? { ...server, icon } : server,
      );
    },
    changeUserMuteStatusWs: (
      state,
      action: PayloadAction<{
        channelId: string;
        userId: string;
        muteStatus: MuteStatus;
      }>,
    ) => {
      const voiceChannel = state.serverData.channels.voiceChannels.find(
        (channel) => channel.channelId === action.payload.channelId,
      );

      if (voiceChannel) {
        const userIndex = voiceChannel.users.findIndex(
          (user) => user.userId === action.payload.userId,
        );

        if (userIndex >= 0) {
          console.log(action.payload);
          voiceChannel.users[userIndex].muteStatus = action.payload.muteStatus;

          /*if (action.payload.muteStatus === MuteStatus.NotMuted) {
            voiceChannel.users[userIndex].isMuted = false;
          } else {
            voiceChannel.users[userIndex].isMuted = true;
          }*/
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserServers.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(
        getUserServers.fulfilled,
        (state, action: PayloadAction<ServerItem[]>) => {
          //console.log(action.payload);
          state.serversList = action.payload;
          state.isLoading = false;
          state.error = '';
        },
      )
      .addCase(getUserServers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getServerData.pending, (state) => {
        state.isLoading = true;
        state.serverData = {
          serverId: '',
          serverName: '',
          serverType: ServerTypeEnum.Student,
          icon: null,
          isClosed: false,
          roles: [],
          userRoles: [],
          users: [],
          channels: {
            textChannels: [],
            voiceChannels: [],
            notificationChannels: [],
          },
          isCreator: false,
          permissions: {
            canChangeRole: false,
            canWorkChannels: false,
            canDeleteUsers: false,
            canMuteOther: false,
            canDeleteOthersMessages: false,
            canIgnoreMaxCount: false,
            canCreateRoles: false,
            canUseInvitations: false,
          },
          isNotifiable: false,
          invitationString: null,
        };
        state.currentChannelId = null;
        state.numberOfMessages = 0;
        state.startMessageId = 0;
        state.remainingTopMessagesCount = 0;
        state.lastTopMessageId = 0;
        state.allMessagesCount = 0;
        state.remainingBottomMessagesCount = MAX_MESSAGE_NUMBER;
        state.lastBottomMessageId = 0;
        state.error = '';
      })
      .addCase(
        getServerData.fulfilled,
        (state, action: PayloadAction<ServerData>) => {
          state.serverData = action.payload;

          const newChannels = action.payload.channels.textChannels;
          let newCurrentChannelId = state.currentChannelId;

          const currentChannel = newChannels.find(
            (channel) => channel.channelId === newCurrentChannelId,
          );

          if (!currentChannel) {
            newCurrentChannelId =
              newChannels.length > 0 ? newChannels[0].channelId : null;
            state.currentChannelId = newCurrentChannelId;

            /* Брать данные из канала */
            const channelData = action.payload.channels.textChannels.find(
              (channel) => channel.channelId === newCurrentChannelId,
            );

            if (channelData) {
              state.startMessageId = channelData.lastReadedMessageId;
              /* Можно добавить state.remaining = data.nonReadedCount */
            }

            state.messages = [];
          }

          state.isLoading = false;
          state.error = '';
        },
      )
      .addCase(getServerData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createServer.pending, (state) => {
        state.error = '';
      })
      .addCase(createServer.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(createServer.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteServer.pending, (state) => {
        state.error = '';
      })
      .addCase(deleteServer.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(deleteServer.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(changeRole.pending, (state) => {
        state.error = '';
      })
      .addCase(changeRole.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(changeRole.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(subscribeToServer.pending, (state) => {
        state.error = '';
      })
      .addCase(subscribeToServer.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(subscribeToServer.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(getChannelMessages.pending, (state) => {
        state.messagesStatus = LoadingState.PENDING;
        state.numberOfMessages = 0;
        state.startMessageId = 0;
        state.remainingTopMessagesCount = 0;
        state.allMessagesCount = 0;
        state.remainingBottomMessagesCount = MAX_MESSAGE_NUMBER;
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getChannelMessages.fulfilled, (state, action) => {
        const { payload } = action;

        const {
          messages,
          allMessagesCount,
          remainingMessagesCount,
          startMessageId,
        } = payload;

        state.messages = messages;
        state.hasNewMessage = false;
        state.messagesStatus = LoadingState.FULFILLED;
        state.isLoading = false;
        state.remainingTopMessagesCount = remainingMessagesCount;

        if (messages.length > 0) {
          state.lastTopMessageId = messages[0].id;
        } else {
          state.lastTopMessageId = 0;
        }

        // remainingBottomMessagesCount ??

        state.lastTopMessageId = messages.length > 0 ? messages[0].id : 0;
        state.lastBottomMessageId =
          messages.length > 0 ? messages[messages.length - 1].id : 0;

        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1];

          if (lastMessage?.id === allMessagesCount) {
            state.remainingBottomMessagesCount = 0;
          }
        } else if (allMessagesCount === 0) {
          state.remainingBottomMessagesCount = 0;
        }

        state.allMessagesCount = allMessagesCount;
        state.startMessageId = startMessageId;

        state.error = '';
      })
      .addCase(getChannelMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.messagesStatus = LoadingState.REJECTED;
        state.error = action.payload as string;
      })
      .addCase(getMoreMessages.pending, (state) => {
        state.messageIsLoading = LoadingState.PENDING;
        state.error = '';
      })
      .addCase(getMoreMessages.fulfilled, (state, action) => {
        const { payload, meta } = action;
        const { messages, remainingMessagesCount, allMessagesCount } = payload;
        const { down } = meta.arg;

        if (!down) {
          const newMessages = messages.slice(0, -1);
          state.messages = [...newMessages, ...state.messages];

          state.remainingTopMessagesCount = remainingMessagesCount;
          state.lastTopMessageId = messages[0].id;
        } else {
          const newMessages = messages.slice(1);
          state.messages = [...state.messages, ...newMessages];

          state.remainingBottomMessagesCount = remainingMessagesCount;
          const lastMessage = newMessages.at(-1);

          if (lastMessage) {
            state.lastBottomMessageId = lastMessage.id;
          }
        }

        state.messageIsLoading = LoadingState.FULFILLED;
        state.allMessagesCount = allMessagesCount;
        //state.startMessageId = startMessageId;

        state.error = '';
      })

      .addCase(getMoreMessages.rejected, (state, action) => {
        state.messageIsLoading = LoadingState.REJECTED;
        state.error = action.payload as string;
      })
      .addCase(createChannel.pending, (state) => {
        state.error = '';
      })
      .addCase(createChannel.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteChannel.pending, (state) => {
        state.error = '';
      })
      .addCase(deleteChannel.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(unsubscribeFromServer.pending, (state) => {
        state.error = '';
      })
      .addCase(unsubscribeFromServer.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(unsubscribeFromServer.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(changeServerName.pending, (state) => {
        state.error = '';
      })
      .addCase(changeServerName.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(changeServerName.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(changeNameOnServer.pending, (state) => {
        state.error = '';
      })
      .addCase(changeNameOnServer.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(changeNameOnServer.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteUserFromServer.pending, (state) => {
        state.error = '';
      })
      .addCase(deleteUserFromServer.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(deleteUserFromServer.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(changeChannelName.pending, (state) => {
        state.error = '';
      })
      .addCase(changeChannelName.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(changeChannelName.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(selfMute.pending, (state) => {
        state.error = '';
      })
      .addCase(selfMute.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(selfMute.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(unbanUser.fulfilled, (state, { meta }) => {
        const { userId } = meta.arg;

        if (state.bannedUsers.length > 0) {
          state.bannedUsers = state.bannedUsers.filter(
            (user) => user.userId !== userId,
          );
        }
      })

      .addCase(
        getBannedUsers.fulfilled,
        (state, action: PayloadAction<BannedUserResponse>) => {
          //console.log(action.payload);
          state.bannedUsers = action.payload.bannedList;
          state.pageBannedUsers = action.payload.page;
          state.totalPagesBannedUsers = action.payload.total;
          state.error = '';
        },
      )

      .addCase(changeVoiceChannelMaxCount.fulfilled, (state, { meta }) => {
        const { voiceChannelId, maxCount } = meta.arg;

        const channelIndex = state.serverData.channels.voiceChannels.findIndex(
          (channel) => channel.channelId === voiceChannelId,
        );

        if (channelIndex !== -1) {
          state.serverData.channels.voiceChannels[channelIndex] = {
            ...state.serverData.channels.voiceChannels[channelIndex],
            maxCount: maxCount,
          };
        }

        state.error = '';
      })

      .addCase(addRole.pending, (state) => {
        state.error = '';
      })
      .addCase(addRole.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(addRole.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(removeRole.pending, (state) => {
        state.error = '';
      })
      .addCase(removeRole.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(removeRole.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(changeServerIcon.pending, (state) => {
        state.error = '';
      })
      .addCase(changeServerIcon.fulfilled, (state, action) => {
        state.serverData.icon = action.payload;
        state.error = '';
      })
      .addCase(changeServerIcon.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(changeServerIsClosed.fulfilled, (state) => {
        state.serverData.isClosed = !state.serverData.isClosed;
        state.error = '';
      })
      .addCase(changeNotifiable.fulfilled, (state, { meta }) => {
        const { serverId } = meta.arg;

        if (state.currentServerId === serverId) {
          state.serverData.isNotifiable = !state.serverData.isNotifiable;
        }
      })

      .addCase(changeChannelNotifiable.fulfilled, (state, { meta }) => {
        const { channelId } = meta.arg;

        const channelIndex = state.serverData.channels.textChannels.findIndex(
          (channel) => channel.channelId === channelId,
        );

        if (channelIndex >= 0) {
          state.serverData.channels.textChannels[channelIndex].isNotifiable =
            !state.serverData.channels.textChannels[channelIndex].isNotifiable;
        }

        const notificationChannelIndex =
          state.serverData.channels.notificationChannels.findIndex(
            (channel) => channel.channelId === channelId,
          );

        if (notificationChannelIndex >= 0) {
          state.serverData.channels.notificationChannels[
            channelIndex
          ].isNotifiable =
            !state.serverData.channels.notificationChannels[channelIndex]
              .isNotifiable;
        }
      })

      .addCase(createInvitation.fulfilled, (state, { meta, payload }) => {
        const { serverId } = meta.arg;

        if (state.currentServerId === serverId) {
          state.serverData.invitationString = payload.invitationString;
        }
        state.error = '';
      })

      .addMatcher(
        isAnyOf(getChannelSettings.fulfilled),
        (state, action: PayloadAction<GetChannelSettings>) => {
          state.roleSettings = action.payload;
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          getChannelSettings.pending,
          changeTextChannelSettings.pending,
          changeSubChannelSettings.pending,
          changeVoiceChannelSettings.pending,
          getBannedUsers.pending,
          unbanUser.pending,
          changeVoiceChannelMaxCount.pending,
          changeNotificationChannelSettings.pending,
          changeServerIsClosed.pending,
          changeNotifiable.pending,
          changeChannelNotifiable.pending,
          createInvitation.pending,
        ),
        (state) => {
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          changeTextChannelSettings.fulfilled,
          changeSubChannelSettings.fulfilled,
          changeVoiceChannelSettings.fulfilled,
          changeNotificationChannelSettings.fulfilled,
        ),
        (state) => {
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          getChannelSettings.rejected,
          changeTextChannelSettings.rejected,
          changeSubChannelSettings.rejected,
          changeVoiceChannelSettings.rejected,
          getBannedUsers.rejected,
          unbanUser.rejected,
          changeVoiceChannelMaxCount.rejected,
          changeNotificationChannelSettings.rejected,
          changeServerIsClosed.rejected,
          changeNotifiable.rejected,
          changeChannelNotifiable.rejected,
          createInvitation.rejected,
        ),
        (state, action) => {
          state.error = action.payload as string;
        },
      );
  },
});

export const {
  setCurrentServerId,
  setCurrentChannelId,
  setCurrentVoiceChannelId,
  addMessage,
  deleteMessageWs,
  editMessageWs,
  addUserWs,
  deleteUserWs,
  clearServerData,
  clearHasNewMessage,
  setNewServerName,
  setNewUserName,
  removeUser,
  removeServer,
  editChannelName,
  addUserOnVoiceChannel,
  removeUserFromVoiceChannel,
  toggleUserMuteStatus,
  updatedRole,
  readMessageWs,
  changeReadedCount,
  readOwnMessage,
  addRoleToUserWs,
  removeRoleFromUserWs,
  updateVoteWs,
  setCurrentNotificationChannelId,
  updateServerIcon,
  changeUserMuteStatusWs,
  setCurrentVoiceChannelName,
  setCurrentVoiceChannelServerId,
} = testServerSlice.actions;

export const ServerReducer = testServerSlice.reducer;
