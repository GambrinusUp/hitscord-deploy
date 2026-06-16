import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ChannelsAPI } from './api/Channels';
import { ServerAPI } from './api/Server';
import {
  ServerItem,
  ServerData,
  ChannelType,
  ChannelSettings,
  GetChannelSettings,
  GetMessage,
  BannedUserResponse,
} from './ServerStore.types';

import { FileResponse } from '~/entities/files';
import { ERROR_MESSAGES } from '~/shared/constants';

interface InitialMessagesPayload extends GetMessage {
  remainingTopMessagesCount: number;
  remainingBottomMessagesCount: number;
}

export const getUserServers = createAsyncThunk<
  ServerItem[],
  undefined,
  { rejectValue: string }
>('testServerSlice/getUserServers', async (_, { rejectWithValue }) => {
  try {
    const response = await ServerAPI.getServers();

    return response.serversList;
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});

export const getServerData = createAsyncThunk<
  ServerData,
  { serverId: string },
  { rejectValue: string }
>(
  'testServerSlice/getServerData',
  async ({ serverId }, { rejectWithValue }) => {
    try {
      const response = await ServerAPI.getServerData(serverId);

      return response;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const createServer = createAsyncThunk<
  void,
  { name: string; serverType: number },
  { rejectValue: string }
>(
  'testServerSlice/createServer',
  async ({ name, serverType }, { rejectWithValue }) => {
    try {
      await ServerAPI.createServer(name, serverType);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const deleteServer = createAsyncThunk<
  void,
  { serverId: string },
  { rejectValue: string }
>('testServerSlice/deleteServer', async ({ serverId }, { rejectWithValue }) => {
  try {
    await ServerAPI.deleteServer(serverId);
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});

export const changeRole = createAsyncThunk<
  void,
  { serverId: string; userId: string; role: string },
  { rejectValue: string }
>(
  'testServerSlice/changeRole',
  async ({ serverId, userId, role }, { rejectWithValue }) => {
    try {
      await ServerAPI.changeRole(serverId, userId, role);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const addRole = createAsyncThunk<
  void,
  { serverId: string; userId: string; role: string },
  { rejectValue: string }
>(
  'testServerSlice/addRole',
  async ({ serverId, userId, role }, { rejectWithValue }) => {
    try {
      await ServerAPI.addRole(serverId, userId, role);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const removeRole = createAsyncThunk<
  void,
  { serverId: string; userId: string; role: string },
  { rejectValue: string }
>(
  'testServerSlice/removeRole',
  async ({ serverId, userId, role }, { rejectWithValue }) => {
    try {
      await ServerAPI.removeRole(serverId, userId, role);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const subscribeToServer = createAsyncThunk<
  void,
  { invitationToken: string; userName: string },
  { rejectValue: string }
>(
  'testServerSlice/subscribeToServer',
  async ({ invitationToken, userName }, { rejectWithValue }) => {
    try {
      await ServerAPI.subscribeToServer(invitationToken, userName);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const unsubscribeFromServer = createAsyncThunk<
  void,
  { serverId: string },
  { rejectValue: string }
>(
  'testServerSlice/unsubscribeFromServer',
  async ({ serverId }, { rejectWithValue }) => {
    try {
      await ServerAPI.unsubscribeFromServer(serverId);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const getChannelMessages = createAsyncThunk<
  InitialMessagesPayload,
  {
    channelId: string;
    number: number;
    fromMessageId: number;
    down: boolean;
  },
  { rejectValue: string }
>(
  'testServerSlice/getChannelMessages',
  async ({ channelId, number, fromMessageId, down }, { rejectWithValue }) => {
    try {
      const response = await ChannelsAPI.getChannelsMessages(
        channelId,
        number,
        fromMessageId,
        down,
      );

      let messages = response.messages;
      let remainingTopMessagesCount = down
        ? 0
        : response.remainingMessagesCount;
      let remainingBottomMessagesCount = down
        ? response.remainingMessagesCount
        : 0;

      const shouldTryLoadDown =
        !down &&
        fromMessageId !== 0 &&
        response.allMessagesCount > 0 &&
        messages.length < number;

      if (shouldTryLoadDown) {
        const anchorMessageId =
          messages.length > 0 ? messages[messages.length - 1].id : fromMessageId;
        const numberToLoad =
          number - messages.length + (messages.length > 0 ? 1 : 0);

        const fallbackResponse = await ChannelsAPI.getChannelsMessages(
          channelId,
          numberToLoad,
          anchorMessageId,
          true,
        );

        const mergedById = new Map<number, (typeof messages)[number]>();
        messages.forEach((message) => mergedById.set(message.id, message));
        fallbackResponse.messages.forEach((message) =>
          mergedById.set(message.id, message),
        );

        messages = [...mergedById.values()].sort((a, b) => a.id - b.id);
        remainingBottomMessagesCount = fallbackResponse.remainingMessagesCount;
      }

      const loadedMessagesCount = messages.length;

      if (!down) {
        remainingBottomMessagesCount =
          remainingBottomMessagesCount > 0
            ? remainingBottomMessagesCount
            : Math.max(
                response.allMessagesCount -
                  loadedMessagesCount -
                  remainingTopMessagesCount,
                0,
              );
      } else {
        remainingTopMessagesCount = Math.max(
          response.allMessagesCount -
            loadedMessagesCount -
            remainingBottomMessagesCount,
          0,
        );
      }

      return {
        ...response,
        messages,
        numberOfMessages: messages.length,
        startMessageId:
          messages.length > 0 ? messages[0].id : response.startMessageId,
        remainingTopMessagesCount,
        remainingBottomMessagesCount,
      };
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const getMoreMessages = createAsyncThunk<
  GetMessage,
  {
    channelId: string;
    number: number;
    fromMessageId: number;
    down: boolean;
  },
  { rejectValue: string }
>(
  'testServerSlice/getMoreMessages',
  async ({ channelId, number, fromMessageId, down }, { rejectWithValue }) => {
    try {
      const response = await ChannelsAPI.getChannelsMessages(
        channelId,
        number,
        fromMessageId,
        down,
      );

      return response;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const createChannel = createAsyncThunk<
  void,
  {
    serverId: string;
    name: string;
    channelType: ChannelType;
    maxCount?: number;
  },
  { rejectValue: string }
>(
  'testServerSlice/createChannel',
  async ({ serverId, name, channelType, maxCount }, { rejectWithValue }) => {
    try {
      await ChannelsAPI.createChannel(serverId, name, channelType, maxCount);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const deleteChannel = createAsyncThunk<
  void,
  {
    channelId: string;
  },
  { rejectValue: string }
>(
  'testServerSlice/deleteChannel',
  async ({ channelId }, { rejectWithValue }) => {
    try {
      await ChannelsAPI.deleteChannel(channelId);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const changeServerName = createAsyncThunk<
  void,
  { serverId: string; name: string },
  { rejectValue: string }
>(
  'testServerSlice/changeServerName',
  async ({ serverId, name }, { rejectWithValue }) => {
    try {
      await ServerAPI.changeServerName(serverId, name);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const changeNameOnServer = createAsyncThunk<
  void,
  { serverId: string; name: string },
  { rejectValue: string }
>(
  'testServerSlice/changeNameOnServer',
  async ({ serverId, name }, { rejectWithValue }) => {
    try {
      await ServerAPI.changeNameOnServer(serverId, name);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const deleteUserFromServer = createAsyncThunk<
  void,
  { serverId: string; userId: string; banReason?: string },
  { rejectValue: string }
>(
  'testServerSlice/deleteUserFromServer',
  async ({ serverId, userId, banReason }, { rejectWithValue }) => {
    try {
      await ServerAPI.deleteUserFromServer(serverId, userId, banReason);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const changeNotificationChannelSettings = createAsyncThunk<
  void,
  { settings: ChannelSettings },
  { rejectValue: string }
>(
  'testServerSlice/changeNotificationChannelSettings',
  async ({ settings }, { rejectWithValue }) => {
    try {
      await ChannelsAPI.changeNotificationChannelSettings(settings);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const changeChannelName = createAsyncThunk<
  void,
  { id: string; name: string },
  { rejectValue: string }
>(
  'testServerSlice/changeChannelName',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      await ChannelsAPI.changeChannelName(id, name);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const creatorUnsubscribeFromServer = createAsyncThunk<
  void,
  { serverId: string; newCreatorId: string },
  { rejectValue: string }
>(
  'testServerSlice/creatorUnsubscribeFromServer',
  async ({ serverId, newCreatorId }, { rejectWithValue }) => {
    try {
      await ServerAPI.creatorUnsubscribeFromServer(serverId, newCreatorId);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const selfMute = createAsyncThunk<
  void,
  undefined,
  { rejectValue: string }
>('testServerSlice/selfMute', async (_, { rejectWithValue }) => {
  try {
    await ChannelsAPI.selfMute();
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});

export const changeTextChannelSettings = createAsyncThunk<
  void,
  { settings: ChannelSettings },
  { rejectValue: string }
>(
  'testServerSlice/changeTextChannelSettings',
  async ({ settings }, { rejectWithValue }) => {
    try {
      await ChannelsAPI.changeTextChannelSettings(settings);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const getChannelSettings = createAsyncThunk<
  GetChannelSettings,
  { channelId: string },
  { rejectValue: string }
>(
  'testServerSlice/getChannelSettings',
  async ({ channelId }, { rejectWithValue }) => {
    try {
      const response = await ChannelsAPI.getChannelSettings(channelId);

      return response;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const changeVoiceChannelSettings = createAsyncThunk<
  void,
  { settings: ChannelSettings },
  { rejectValue: string }
>(
  'testServerSlice/changeVoiceChannelSettings',
  async ({ settings }, { rejectWithValue }) => {
    try {
      await ChannelsAPI.changeVoiceChannelSettings(settings);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const getBannedUsers = createAsyncThunk<
  BannedUserResponse,
  { serverId: string; page: number; size: number },
  { rejectValue: string }
>(
  'testServerSlice/getBannedUsers',
  async ({ serverId, page, size }, { rejectWithValue }) => {
    try {
      const response = await ServerAPI.getBannedUsers(serverId, page, size);

      return response;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const unbanUser = createAsyncThunk<
  void,
  { userId: string; serverId: string },
  { rejectValue: string }
>(
  'testServerSlice/unbanUser',
  async ({ userId, serverId }, { rejectWithValue }) => {
    try {
      await ServerAPI.unbanUser(userId, serverId);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const changeVoiceChannelMaxCount = createAsyncThunk<
  void,
  { voiceChannelId: string; maxCount: number },
  { rejectValue: string }
>(
  'testServerSlice/changeVoiceChannelMaxCount',
  async ({ voiceChannelId, maxCount }, { rejectWithValue }) => {
    try {
      await ChannelsAPI.changeVoiceChannelMaxCount(voiceChannelId, maxCount);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const changeServerIcon = createAsyncThunk<
  FileResponse,
  { serverId: string; icon: File },
  { rejectValue: string }
>(
  'testServerSlice/changeServerIcon',
  async ({ serverId, icon }, { rejectWithValue }) => {
    try {
      const response = await ServerAPI.changeServerIcon(serverId, icon);

      return response;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(
          e.response?.data?.message || ERROR_MESSAGES.DEFAULT,
        );
      }

      return rejectWithValue(ERROR_MESSAGES.DEFAULT);
    }
  },
);

export const changeServerIsClosed = createAsyncThunk<
  void,
  {
    serverId: string;
    isClosed: boolean;
    isApprove?: boolean;
  },
  { rejectValue: string }
>(
  'testServerSlice/changeServerIsClosed',
  async ({ serverId, isClosed, isApprove }, { rejectWithValue }) => {
    try {
      await ServerAPI.changeServerIsClosed(serverId, isClosed, isApprove);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const changeNotifiable = createAsyncThunk<
  void,
  { serverId: string },
  { rejectValue: string }
>(
  'testServerSlice/changeNotifiable',
  async ({ serverId }, { rejectWithValue }) => {
    try {
      await ServerAPI.changeNotifiable(serverId);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const changeChannelNotifiable = createAsyncThunk<
  void,
  { channelId: string },
  { rejectValue: string }
>(
  'testServerSlice/changeChannelNotifiable',
  async ({ channelId }, { rejectWithValue }) => {
    try {
      await ChannelsAPI.changeChannelNotifiable(channelId);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const changeSubChannelSettings = createAsyncThunk<
  void,
  { settings: ChannelSettings },
  { rejectValue: string }
>(
  'testServerSlice/changeSubChannelSettings',
  async ({ settings }, { rejectWithValue }) => {
    try {
      await ChannelsAPI.changeSubChannelSettings(settings);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const createInvitation = createAsyncThunk<
  { invitationString: string },
  { serverId: string; expiredAt: string },
  { rejectValue: string }
>(
  'testServerSlice/createInvitation',
  async ({ serverId, expiredAt }, { rejectWithValue }) => {
    try {
      const response = await ServerAPI.createInvitation(serverId, expiredAt);

      return response;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);
