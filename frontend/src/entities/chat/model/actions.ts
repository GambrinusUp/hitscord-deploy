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

interface InitialMessagesPayload extends GetChatMessages {
  remainingTopMessagesCount: number;
  remainingBottomMessagesCount: number;
}

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
  InitialMessagesPayload,
  GetMessagesParams,
  { rejectValue: string }
>(
  'chatsSlice/getChatMessages',
  async ({ chatId, number, fromMessageId, down }, { rejectWithValue }) => {
    try {
      const response = await ChatsAPI.getChatMessages(
        chatId,
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

        const fallbackResponse = await ChatsAPI.getChatMessages(
          chatId,
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
