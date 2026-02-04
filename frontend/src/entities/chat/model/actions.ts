import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  Chat,
  ChatInfo,
  GetChatMessages,
  GetChats,
  GetMessagesParams,
} from './types';

import { ChatsAPI } from '~/entities/chat/api';
import { FileResponse } from '~/entities/files';
import { ERROR_MESSAGES } from '~/shared/constants';
import { RootState } from '~/store/store';

export const createChat = createAsyncThunk<
  Chat,
  { userTag: string },
  { rejectValue: string }
>('chatsSlice/createChat', async ({ userTag }, { rejectWithValue }) => {
  try {
    const response = await ChatsAPI.createChat(userTag);

    return response;
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});

export const changeChatName = createAsyncThunk<
  void,
  { chatId: string; name: string },
  { rejectValue: string }
>(
  'chatsSlice/changeChatName',
  async ({ chatId, name }, { rejectWithValue }) => {
    try {
      await ChatsAPI.changeChatName(chatId, name);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const getChats = createAsyncThunk<
  GetChats,
  void,
  { rejectValue: string }
>('chatsSlice/getChats', async (_, { rejectWithValue }) => {
  try {
    const response = await ChatsAPI.getChats();

    return response;
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});

export const getChatInfo = createAsyncThunk<
  ChatInfo,
  { chatId: string },
  { rejectValue: string }
>('chatsSlice/getChatInfo', async ({ chatId }, { rejectWithValue }) => {
  try {
    const response = await ChatsAPI.getChatInfo(chatId);

    return response;
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});

export const getChatMessages = createAsyncThunk<
  GetChatMessages,
  GetMessagesParams,
  { rejectValue: string; state: RootState }
>(
  'chatsSlice/getChatMessages',
  async (
    { chatId, number, fromMessageId, down },
    { rejectWithValue, getState },
  ) => {
    try {
      const response = await ChatsAPI.getChatMessages(
        chatId,
        number,
        fromMessageId,
        down,
      );

      if (response.messages.length > 0) {
        return response;
      }

      const state = getState();
      const chatStore = state.chatsStore;

      const chat = chatStore.chatsList?.find((c) => c.chatId === chatId);

      const hasUnread =
        (chat?.nonReadedCount ?? 0) > 0 ||
        (chat?.nonReadedTaggedCount ?? 0) > 0;

      const shouldLoadDown =
        !down &&
        fromMessageId !== 0 &&
        response.messages.length === 0 &&
        hasUnread;

      if (shouldLoadDown) {
        const fallbackResponse = await ChatsAPI.getChatMessages(
          chatId,
          number,
          fromMessageId,
          true,
        );

        return fallbackResponse;
      }

      return response;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const getMoreChatMessages = createAsyncThunk<
  GetChatMessages,
  GetMessagesParams,
  { rejectValue: string }
>(
  'chatsSlice/getMoreChatMessages',
  async ({ chatId, number, fromMessageId, down }, { rejectWithValue }) => {
    try {
      const response = await ChatsAPI.getChatMessages(
        chatId,
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

export const addUserInChat = createAsyncThunk<
  void,
  { chatId: string; userTag: string },
  { rejectValue: string }
>(
  'chatsSlice/addUserInChat',
  async ({ chatId, userTag }, { rejectWithValue }) => {
    try {
      await ChatsAPI.addUserInChat(chatId, userTag);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const goOutFromChat = createAsyncThunk<
  void,
  { id: string },
  { rejectValue: string }
>('chatsSlice/goOutFromChat', async ({ id }, { rejectWithValue }) => {
  try {
    await ChatsAPI.goOutFromChat(id);
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});

export const changeChatIcon = createAsyncThunk<
  FileResponse,
  { chatId: string; icon: File },
  { rejectValue: string }
>(
  'chatsSlice/changeChatIcon',
  async ({ chatId, icon }, { rejectWithValue }) => {
    try {
      const response = await ChatsAPI.changeChatIcon(chatId, icon);

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

export const changeChatNotifiable = createAsyncThunk<
  void,
  { chatId: string },
  { rejectValue: string }
>(
  'chatsSlice/changeChatNotifiable',
  async ({ chatId }, { rejectWithValue }) => {
    try {
      await ChatsAPI.changeChatNotifiable(chatId);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);
