import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getMoreSubChatMessages, getSubChatMessages } from './actions';
import { SUB_CHAT_SLICE_NAME } from './const';
import { GetSubChatMessages, SubChatInfo, SubChatState } from './types';

import { MAX_MESSAGE_NUMBER } from '~/constants';
import { LoadingState } from '~/shared';
import { ChannelMessage } from '~/store/ServerStore';

const initialState: SubChatState = {
  error: '',
  currentSubChatId: null,
  subChatInfo: null,
  messages: [],
  messagesStatus: LoadingState.IDLE,
  messageIsLoading: LoadingState.IDLE,
  remainingTopMessagesCount: 0,
  lastTopMessageId: 0,
  remainingBottomMessagesCount: MAX_MESSAGE_NUMBER,
  lastBottomMessageId: 0,
  startMessageId: 0,
  allMessagesCount: 0,
};

export const SubChatSlice = createSlice({
  name: SUB_CHAT_SLICE_NAME,
  initialState,
  reducers: {
    setCurrentSubChatId(state, action: PayloadAction<string | null>) {
      state.currentSubChatId = action.payload;
    },
    setSubChatInfo(state, action: PayloadAction<SubChatInfo | null>) {
      state.subChatInfo = action.payload;
    },
    addSubChatMessage: (state, action: PayloadAction<ChannelMessage>) => {
      const { channelId } = action.payload;

      if (channelId === state.currentSubChatId) {
        if (state.remainingBottomMessagesCount <= 0) {
          state.messages.push(action.payload);
        }
      }
    },
    deleteSubChatMessageWS: (
      state,
      action: PayloadAction<{ channelId: string; messageId: number }>,
    ) => {
      if (state.currentSubChatId === action.payload.channelId) {
        state.messages = state.messages.filter(
          (message) => message.id !== action.payload.messageId,
        );
      }
    },
    editSubChatMessageWS: (state, action: PayloadAction<ChannelMessage>) => {
      if (state.currentSubChatId === action.payload.channelId) {
        const index = state.messages.findIndex(
          (message) => message.id === action.payload.id,
        );

        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      }
    },
    updateSubChatVoteWs: (state, action: PayloadAction<ChannelMessage>) => {
      const index = state.messages.findIndex(
        (message) => message.id === action.payload.id,
      );

      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubChatMessages.pending, (state) => {
        state.messagesStatus = LoadingState.PENDING;
        state.remainingTopMessagesCount = 0;
        state.lastTopMessageId = 0;
        state.remainingBottomMessagesCount = MAX_MESSAGE_NUMBER;
        state.lastBottomMessageId = 0;
        //state.startMessageId = 0;
        state.allMessagesCount = 0;
        state.messages = [];
        state.error = '';
      })
      // обработать случаи, когда массив пустой
      .addCase(
        getSubChatMessages.fulfilled,
        (state, action: PayloadAction<GetSubChatMessages>) => {
          const { payload } = action;
          const { messages, allMessagesCount, remainingMessagesCount } =
            payload;

          state.messages = messages;

          //
          if (messages.length > 0) {
            state.remainingTopMessagesCount = remainingMessagesCount;
          } else {
            state.remainingTopMessagesCount = 0;
          }

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
          //state.startMessageId = startMessageId;
          state.messagesStatus = LoadingState.FULFILLED;
          state.error = '';
        },
      )
      .addCase(getSubChatMessages.rejected, (state, action) => {
        state.messagesStatus = LoadingState.REJECTED;
        state.error = action.payload as string;
      })
      .addCase(getMoreSubChatMessages.pending, (state) => {
        state.messageIsLoading = LoadingState.PENDING;
        state.error = '';
      })
      .addCase(getMoreSubChatMessages.fulfilled, (state, action) => {
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

        state.error = '';
      })
      .addCase(getMoreSubChatMessages.rejected, (state, action) => {
        state.messageIsLoading = LoadingState.REJECTED;
        state.error = action.payload as string;
      });
  },
});

export const {
  addSubChatMessage,
  setCurrentSubChatId,
  editSubChatMessageWS,
  deleteSubChatMessageWS,
  updateSubChatVoteWs,
  setSubChatInfo,
} = SubChatSlice.actions;

export const subChatReducer = SubChatSlice.reducer;
