import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { GET_MORE_SUB_CHAT_MESSAGES, GET_SUB_CHAT_MESSAGES } from './const';
import { GetMessagesParams, GetSubChatMessages } from './types';

import { SubChatAPI } from '~/entities/subChat/api';
import { RootState } from '~/store/store';

export const getSubChatMessages = createAsyncThunk<
  GetSubChatMessages,
  GetMessagesParams,
  { rejectValue: string; state: RootState }
>(
  GET_SUB_CHAT_MESSAGES,
  async (
    { chatId, number, fromMessageId, down },
    { rejectWithValue, getState },
  ) => {
    try {
      const response = await SubChatAPI.getSubChatMessages(
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
        const fallbackResponse = await SubChatAPI.getSubChatMessages(
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

export const getMoreSubChatMessages = createAsyncThunk<
  GetSubChatMessages,
  GetMessagesParams,
  { rejectValue: string }
>(
  GET_MORE_SUB_CHAT_MESSAGES,
  async ({ chatId, number, fromMessageId, down }, { rejectWithValue }) => {
    try {
      const response = await SubChatAPI.getSubChatMessages(
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
