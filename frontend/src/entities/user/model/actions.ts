import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  CHANGE_NOTIFICATION_LIFETIME_ACTION_NAME,
  CHANGE_PROFILE_ACTION_NAME,
  CHANGE_PROFILE_ICON_ACTION_NAME,
  CHANGE_SETTINGS_ACTION_NAME,
  GET_USER_PROFILE_ACTION_NAME,
  LOGIN_USER_ACTION_NAME,
  LOGOUT_ACTION_NAME,
  REFRESH_ACTION_NAME,
  REGISTER_USER_ACTION_NAME,
} from './const';
import {
  ChangeProfileData,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  SettingType,
  User,
} from './types';

import { FileResponse } from '~/entities/files';
import { UserAPI } from '~/entities/user/api';
import { ERROR_MESSAGES } from '~/shared/constants';

export const registerUser = createAsyncThunk<
  LoginResponse,
  RegisterCredentials,
  { rejectValue: string }
>(REGISTER_USER_ACTION_NAME, async (user, { rejectWithValue }) => {
  try {
    const response = UserAPI.registerUser(user);

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

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>(LOGIN_USER_ACTION_NAME, async (loginData, { rejectWithValue }) => {
  try {
    const response = await UserAPI.loginUser(loginData);

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

export const getUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(GET_USER_PROFILE_ACTION_NAME, async (_, { rejectWithValue }) => {
  try {
    const response = await UserAPI.getProfile();

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

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  LOGOUT_ACTION_NAME,
  async (_, { rejectWithValue }) => {
    try {
      await UserAPI.logout();
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

export const refreshTokens = createAsyncThunk<
  LoginResponse,
  { refreshToken: string },
  { rejectValue: string }
>(REFRESH_ACTION_NAME, async ({ refreshToken }, { rejectWithValue }) => {
  try {
    const response = await UserAPI.refresh(refreshToken);

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

export const changeSettings = createAsyncThunk<
  void,
  { type: SettingType },
  { rejectValue: string }
>(CHANGE_SETTINGS_ACTION_NAME, async ({ type }, { rejectWithValue }) => {
  try {
    await UserAPI.changeSettings(type);
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(
        e.response?.data?.message || ERROR_MESSAGES.DEFAULT,
      );
    }

    return rejectWithValue(ERROR_MESSAGES.DEFAULT);
  }
});

export const changeNotificationLifetime = createAsyncThunk<
  void,
  { time: number },
  { rejectValue: string }
>(
  CHANGE_NOTIFICATION_LIFETIME_ACTION_NAME,
  async ({ time }, { rejectWithValue }) => {
    try {
      await UserAPI.changeNotificationLifetime(time);
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

export const changeUserProfile = createAsyncThunk<
  User,
  { newProfile: ChangeProfileData },
  { rejectValue: string }
>(CHANGE_PROFILE_ACTION_NAME, async ({ newProfile }, { rejectWithValue }) => {
  try {
    const response = await UserAPI.changeProfile(newProfile);

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

export const changeProfileIcon = createAsyncThunk<
  FileResponse,
  { icon: File },
  { rejectValue: string }
>(CHANGE_PROFILE_ICON_ACTION_NAME, async ({ icon }, { rejectWithValue }) => {
  try {
    const response = await UserAPI.changeProfileIcon(icon);

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
