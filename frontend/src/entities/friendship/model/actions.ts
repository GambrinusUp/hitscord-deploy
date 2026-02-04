import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  APPROVE_APPLICATION_ACTION_NAME,
  CREATE_APPLICATION_ACTION_NAME,
  DECLINE_APPLICATION_ACTION_NAME,
  DELETE_APPLICATION_ACTION_NAME,
  DELETE_FRIENDSHIP_ACTION_NAME,
  GET_APPLICATIONS_FROM_ACTION_NAME,
  GET_APPLICATIONS_TO_ACTION_NAME,
  GET_FRIENDSHIP_LIST_ACTION_NAME,
} from './const';
import { GetApplication, GetFriends } from './types';

import { FriendshipAPI } from '~/entities/friendship/api';
import { ERROR_MESSAGES } from '~/shared/constants';

export const createApplication = createAsyncThunk<
  void,
  { userTag: string },
  { rejectValue: string }
>(CREATE_APPLICATION_ACTION_NAME, async ({ userTag }, { rejectWithValue }) => {
  try {
    await FriendshipAPI.createApplication(userTag);
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(
        e.response?.data?.message || ERROR_MESSAGES.DEFAULT,
      );
    }

    return rejectWithValue(ERROR_MESSAGES.DEFAULT);
  }
});

export const getApplicationsFrom = createAsyncThunk<
  GetApplication,
  void,
  { rejectValue: string }
>(GET_APPLICATIONS_FROM_ACTION_NAME, async (_, { rejectWithValue }) => {
  try {
    const response = await FriendshipAPI.getApplicationFrom();

    return response;
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(
        e.response?.data?.message || ERROR_MESSAGES.DEFAULT,
      );
    }

    return rejectWithValue(ERROR_MESSAGES.DEFAULT);
  }
});

export const getApplicationsTo = createAsyncThunk<
  GetApplication,
  void,
  { rejectValue: string }
>(GET_APPLICATIONS_TO_ACTION_NAME, async (_, { rejectWithValue }) => {
  try {
    const response = await FriendshipAPI.getApplicationTo();

    return response;
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(
        e.response?.data?.message || ERROR_MESSAGES.DEFAULT,
      );
    }

    return rejectWithValue(ERROR_MESSAGES.DEFAULT);
  }
});

export const approveApplication = createAsyncThunk<
  void,
  { applicationId: string },
  { rejectValue: string }
>(
  APPROVE_APPLICATION_ACTION_NAME,
  async ({ applicationId }, { rejectWithValue }) => {
    try {
      await FriendshipAPI.approveApplication(applicationId);
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

export const declineApplication = createAsyncThunk<
  void,
  { applicationId: string },
  { rejectValue: string }
>(
  DECLINE_APPLICATION_ACTION_NAME,
  async ({ applicationId }, { rejectWithValue }) => {
    try {
      await FriendshipAPI.declineApplication(applicationId);
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

export const deleteApplication = createAsyncThunk<
  void,
  { applicationId: string },
  { rejectValue: string }
>(
  DELETE_APPLICATION_ACTION_NAME,
  async ({ applicationId }, { rejectWithValue }) => {
    try {
      await FriendshipAPI.deleteApplication(applicationId);
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

export const getFriendshipList = createAsyncThunk<
  GetFriends,
  void,
  { rejectValue: string }
>(GET_FRIENDSHIP_LIST_ACTION_NAME, async (_, { rejectWithValue }) => {
  try {
    const response = await FriendshipAPI.getFriendshipList();

    return response;
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(
        e.response?.data?.message || ERROR_MESSAGES.DEFAULT,
      );
    }

    return rejectWithValue(ERROR_MESSAGES.DEFAULT);
  }
});

export const deleteFriendship = createAsyncThunk<
  void,
  { userId: string },
  { rejectValue: string }
>(DELETE_FRIENDSHIP_ACTION_NAME, async ({ userId }, { rejectWithValue }) => {
  try {
    await FriendshipAPI.deleteFriendship(userId);
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(
        e.response?.data?.message || ERROR_MESSAGES.DEFAULT,
      );
    }

    return rejectWithValue(ERROR_MESSAGES.DEFAULT);
  }
});
