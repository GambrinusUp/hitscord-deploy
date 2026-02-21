import { createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';

import {
  createChat,
  changeChatName,
  getChats,
  getChatInfo,
  getChatMessages,
  getMoreChatMessages,
  goOutFromChat,
  addUserInChat,
  changeChatIcon,
  changeChatNotifiable,
} from './actions';
import {
  ChatsState,
  ChatMessage,
  Chat,
  GetChats,
  ChatInfo,
  UserInChat,
} from './types';

import { MAX_MESSAGE_NUMBER } from '~/constants';
import { FileResponse } from '~/entities/files';
import { LoadingState } from '~/shared';

const initialState: ChatsState = {
  chatsList: [],
  chatsLoading: LoadingState.IDLE,
  error: '',
  chat: {
    chatId: '',
    chatName: '',
    users: [],
    nonReadedCount: 0,
    nonReadedTaggedCount: 0,
    lastReadedMessageId: 0,
    nonNotifiable: false,
    icon: null,
  },
  activeChat: null,
  chatLoading: LoadingState.IDLE,
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

export const ChatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChat = action.payload;
      state.messages = [];
      state.remainingTopMessagesCount = 0;
      state.lastTopMessageId = 0;
      state.remainingBottomMessagesCount = MAX_MESSAGE_NUMBER;
      state.lastBottomMessageId = 0;
      state.startMessageId = 0;
      state.allMessagesCount = 0;
      state.error = '';
    },
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      const { channelId } = action.payload;

      if (channelId === state.activeChat) {
        if (state.remainingBottomMessagesCount <= 0) {
          state.messages.push(action.payload);
        }
      }
    },
    deleteChatMessageWS: (
      state,
      action: PayloadAction<{ chatId: string; messageId: number }>,
    ) => {
      if (state.activeChat === action.payload.chatId) {
        state.messages = state.messages.filter(
          (message) => message.id !== action.payload.messageId,
        );
      }
    },
    editChatMessageWS: (state, action: PayloadAction<ChatMessage>) => {
      if (state.activeChat === action.payload.channelId) {
        const index = state.messages.findIndex(
          (message) => message.id === action.payload.id,
        );

        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      }
    },
    readChatMessageWs: (
      state,
      action: PayloadAction<{
        readChatId: string;
        readedMessageId: number;
        isTagged: boolean;
      }>,
    ) => {
      const { readChatId, readedMessageId, isTagged } = action.payload;
      const chatIndex = state.chatsList.findIndex(
        (chat) => chat.chatId === readChatId,
      );

      if (state.activeChat === readChatId) {
        state.chat.nonReadedCount = Math.max(0, state.chat.nonReadedCount - 1);

        if (isTagged) {
          state.chat.nonReadedTaggedCount = Math.max(
            0,
            state.chat.nonReadedTaggedCount - 1,
          );
        }

        state.chat.lastReadedMessageId = readedMessageId;
      }

      if (chatIndex >= 0) {
        state.chatsList[chatIndex].nonReadedCount = Math.max(
          0,
          state.chatsList[chatIndex].nonReadedCount - 1,
        );

        if (isTagged) {
          state.chatsList[chatIndex].nonReadedTaggedCount = Math.max(
            0,
            state.chatsList[chatIndex].nonReadedTaggedCount - 1,
          );
        }

        state.chatsList[chatIndex].lastReadedMessageId = readedMessageId;
      }
    },
    changeChatReadedCount: (
      state,
      action: PayloadAction<{
        readChatId: string;
        readedMessageId: number;
        isTagged: boolean;
      }>,
    ) => {
      const { readChatId, isTagged } = action.payload;

      if (state.activeChat === readChatId) {
        state.chat.nonReadedCount += 1;

        if (isTagged) {
          state.chat.nonReadedTaggedCount += 1;
        }
      }

      const chatIndex = state.chatsList.findIndex(
        (chat) => chat.chatId === readChatId,
      );

      if (chatIndex >= 0) {
        state.chatsList[chatIndex].nonReadedCount += 1;

        if (isTagged) {
          state.chatsList[chatIndex].nonReadedTaggedCount += 1;
        }
      }
    },
    readOwnChatMessage: (
      state,
      action: PayloadAction<{ readChatId: string; readedMessageId: number }>,
    ) => {
      const { readChatId, readedMessageId } = action.payload;
      const chatIndex = state.chatsList.findIndex(
        (chat) => chat.chatId === readChatId,
      );

      if (state.activeChat === readChatId) {
        state.chat.lastReadedMessageId = readedMessageId;
      }

      if (chatIndex >= 0) {
        state.chatsList[chatIndex].lastReadedMessageId = readedMessageId;
      }
    },
    addUserInChatWs: (state, action: PayloadAction<UserInChat>) => {
      const { chatId } = action.payload;

      if (state.activeChat === chatId) {
        state.chat.users.push(action.payload);
      }
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state.chatsList.push(action.payload);
    },
    updateChatIcon: (
      state,
      action: PayloadAction<{ chatId: string; icon: FileResponse }>,
    ) => {
      const { chatId, icon } = action.payload;

      const chatIndex = state.chatsList.findIndex(
        (chat) => chat.chatId === chatId,
      );

      if (chatIndex >= 0) {
        state.chatsList[chatIndex].icon = icon;
      }

      if (state.activeChat === chatId) {
        state.chat.icon = icon;
      }
    },
    updateChatVoteWs: (state, action: PayloadAction<ChatMessage>) => {
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
      .addCase(createChat.pending, (state) => {
        state.error = '';
      })
      .addCase(createChat.fulfilled, (state, action: PayloadAction<Chat>) => {
        state.chatsList = [...state.chatsList, action.payload];
        state.error = '';
      })
      .addCase(createChat.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(changeChatName.pending, (state) => {
        state.error = '';
      })
      .addCase(changeChatName.fulfilled, (state, { meta }) => {
        const { chatId, name } = meta.arg;

        state.chatsList = state.chatsList.map((chat) =>
          chat.chatId === chatId ? { ...chat, name } : chat,
        );

        if (state.chat.chatId === chatId) {
          state.chat.chatName = name;
        }

        state.error = '';
      })
      .addCase(changeChatName.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(getChats.pending, (state) => {
        state.error = '';
        state.chatsList = [];
        state.chatsLoading = LoadingState.PENDING;
      })
      .addCase(getChats.fulfilled, (state, action: PayloadAction<GetChats>) => {
        state.chatsList = action.payload.chatsList;
        state.chatsLoading = LoadingState.FULFILLED;
        state.error = '';
      })
      .addCase(getChats.rejected, (state, action) => {
        state.chatsLoading = LoadingState.REJECTED;
        state.chat = {
          chatId: '',
          chatName: '',
          users: [],
          nonReadedCount: 0,
          nonReadedTaggedCount: 0,
          lastReadedMessageId: 0,
          nonNotifiable: false,
          icon: null,
        };
        state.error = action.payload as string;
      })

      .addCase(getChatInfo.pending, (state) => {
        state.error = '';
        state.chat = {
          chatId: '',
          chatName: '',
          users: [],
          nonReadedCount: 0,
          nonReadedTaggedCount: 0,
          lastReadedMessageId: 0,
          nonNotifiable: false,
          icon: null,
        };
        state.remainingTopMessagesCount = 0;
        state.lastTopMessageId = 0;
        state.remainingBottomMessagesCount = MAX_MESSAGE_NUMBER;
        state.lastBottomMessageId = 0;
        state.startMessageId = 0;
        state.allMessagesCount = 0;
        state.messages = [];
        state.chatLoading = LoadingState.PENDING;
      })
      .addCase(
        getChatInfo.fulfilled,
        (state, action: PayloadAction<ChatInfo>) => {
          state.chat = action.payload;
          state.startMessageId = action.payload.lastReadedMessageId;
          state.chatLoading = LoadingState.FULFILLED;
          state.error = '';
        },
      )
      .addCase(getChatInfo.rejected, (state, action) => {
        state.chatLoading = LoadingState.REJECTED;
        state.error = action.payload as string;
      })

      .addCase(getChatMessages.pending, (state) => {
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
      .addCase(getChatMessages.fulfilled, (state, action) => {
        const { payload } = action;
        const {
          messages,
          allMessagesCount,
          remainingTopMessagesCount,
          remainingBottomMessagesCount,
        } = payload;

        state.messages = messages;

        state.remainingTopMessagesCount = remainingTopMessagesCount;
        state.remainingBottomMessagesCount = remainingBottomMessagesCount;

        state.lastTopMessageId = messages.length > 0 ? messages[0].id : 0;
        state.lastBottomMessageId =
          messages.length > 0 ? messages[messages.length - 1].id : 0;

        state.allMessagesCount = allMessagesCount;
        //state.startMessageId = startMessageId;
        state.messagesStatus = LoadingState.FULFILLED;
        state.error = '';
      })
      .addCase(getChatMessages.rejected, (state, action) => {
        state.messagesStatus = LoadingState.REJECTED;
        state.error = action.payload as string;
      })
      .addCase(getMoreChatMessages.pending, (state) => {
        state.messageIsLoading = LoadingState.PENDING;
        state.error = '';
      })
      .addCase(getMoreChatMessages.fulfilled, (state, action) => {
        const { payload, meta } = action;
        const { messages, remainingMessagesCount, allMessagesCount } = payload;
        const { down } = meta.arg;

        if (messages.length === 0) {
          if (down) {
            state.remainingBottomMessagesCount = 0;
          } else {
            state.remainingTopMessagesCount = 0;
          }

          state.messageIsLoading = LoadingState.FULFILLED;
          state.allMessagesCount = allMessagesCount;
          state.error = '';

          return;
        }

        if (!down) {
          const newMessages = messages.slice(0, -1);

          if (newMessages.length === 0) {
            state.remainingTopMessagesCount = 0;
            state.messageIsLoading = LoadingState.FULFILLED;
            state.allMessagesCount = allMessagesCount;
            state.error = '';

            return;
          }

          state.messages = [...newMessages, ...state.messages];

          state.remainingTopMessagesCount = remainingMessagesCount;
          state.lastTopMessageId = messages[0].id;
        } else {
          const newMessages = messages.slice(1);

          if (newMessages.length === 0) {
            state.remainingBottomMessagesCount = 0;
            state.messageIsLoading = LoadingState.FULFILLED;
            state.allMessagesCount = allMessagesCount;
            state.error = '';

            return;
          }

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
      .addCase(getMoreChatMessages.rejected, (state, action) => {
        state.messageIsLoading = LoadingState.REJECTED;
        state.error = action.payload as string;
      })

      .addCase(goOutFromChat.fulfilled, (state, { meta }) => {
        const chatId = meta.arg.id;
        state.chatsList = state.chatsList.filter(
          (chat) => chat.chatId !== chatId,
        );
        state.error = '';
      })

      .addCase(changeChatIcon.fulfilled, (state, action) => {
        state.chat.icon = action.payload;
        state.error = '';
      })

      .addCase(changeChatNotifiable.fulfilled, (state) => {
        state.chat.nonNotifiable = !state.chat.nonNotifiable;
      })

      .addMatcher(
        isAnyOf(
          addUserInChat.pending,
          goOutFromChat.pending,
          changeChatIcon.pending,
          changeChatNotifiable.pending,
        ),
        (state) => {
          state.error = '';
        },
      )
      .addMatcher(isAnyOf(addUserInChat.fulfilled), (state) => {
        state.error = '';
      })
      .addMatcher(
        isAnyOf(
          addUserInChat.rejected,
          goOutFromChat.rejected,
          changeChatIcon.rejected,
          changeChatNotifiable.rejected,
        ),
        (state, action) => {
          state.error = action.payload as string;
        },
      );
  },
});

export const {
  setActiveChat,
  addChatMessage,
  deleteChatMessageWS,
  editChatMessageWS,
  readChatMessageWs,
  changeChatReadedCount,
  readOwnChatMessage,
  addUserInChatWs,
  addChat,
  updateChatIcon,
  updateChatVoteWs,
} = ChatsSlice.actions;

export const chatsReducer = ChatsSlice.reducer;
