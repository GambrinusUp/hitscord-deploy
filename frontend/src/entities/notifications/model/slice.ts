import { createSlice } from '@reduxjs/toolkit';

import {
  deleteNotification,
  getNotifications,
  readNotification,
} from './actions';
import { NotificationItem, NotificationsState } from './types';

import { logoutUser } from '~/entities/user';
import { LoadingState } from '~/shared';

const sortNotifications = (items: NotificationItem[]) =>
  [...items].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

const initialState: NotificationsState = {
  items: [],
  page: 0,
  size: 20,
  total: 0,
  loading: LoadingState.IDLE,
  loadingMore: LoadingState.IDLE,
  initialized: false,
  error: '',
};

export const NotificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state, action) => {
        const append = action.meta.arg.append ?? false;

        state.error = '';

        if (append) {
          state.loadingMore = LoadingState.PENDING;
        } else {
          state.loading = LoadingState.PENDING;
        }
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        const { notifications, page, size, total, append } = action.payload;
        const normalizedNotifications = sortNotifications(notifications ?? []);

        state.items = append
          ? sortNotifications([
              ...state.items,
              ...normalizedNotifications.filter(
                (item) =>
                  !state.items.some((existing) => existing.id === item.id),
              ),
            ])
          : normalizedNotifications;
        state.page = page;
        state.size = size;
        state.total = total;
        state.initialized = true;
        state.loading = LoadingState.FULFILLED;
        state.loadingMore = LoadingState.FULFILLED;
        state.error = '';
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = LoadingState.REJECTED;
        state.loadingMore = LoadingState.REJECTED;
        state.error = action.payload as string;
      })
      .addCase(readNotification.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload ? { ...item, isReaded: true } : item,
        );
        state.error = '';
      })
      .addCase(readNotification.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.total = Math.max(state.total - 1, 0);
        state.error = '';
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(logoutUser.rejected, () => initialState);
  },
});

export const { clearNotifications } = NotificationsSlice.actions;

export const notificationsReducer = NotificationsSlice.reducer;
