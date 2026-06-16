import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  NotificationListResponse,
  NotificationQueryParams,
} from './types';

import { NotificationsAPI } from '~/entities/notifications/api';
import { ERROR_MESSAGES } from '~/shared/constants';

export const getNotifications = createAsyncThunk<
  NotificationListResponse & { append: boolean },
  NotificationQueryParams & { append?: boolean },
  { rejectValue: string }
>(
  'notifications/getNotifications',
  async ({ page, size, append = false }, { rejectWithValue }) => {
    try {
      const response = await NotificationsAPI.getNotifications({ page, size });

      return {
        ...response,
        append,
      };
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

export const readNotification = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>('notifications/readNotification', async ({ id }, { rejectWithValue }) => {
  try {
    await NotificationsAPI.readNotification(id);

    return id;
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(
        e.response?.data?.message || ERROR_MESSAGES.DEFAULT,
      );
    }

    return rejectWithValue(ERROR_MESSAGES.DEFAULT);
  }
});

export const deleteNotification = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>('notifications/deleteNotification', async ({ id }, { rejectWithValue }) => {
  try {
    await NotificationsAPI.deleteNotification(id);

    return id;
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(
        e.response?.data?.message || ERROR_MESSAGES.DEFAULT,
      );
    }

    return rejectWithValue(ERROR_MESSAGES.DEFAULT);
  }
});
