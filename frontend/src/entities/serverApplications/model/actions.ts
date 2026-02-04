import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  APPROVE_SERVER_APPLICATION_ACTION_NAME,
  GET_SERVER_APPLICATIONS_ACTION_NAME,
  GET_USER_APPLICATIONS_ACTION_NAME,
  REMOVE_SERVER_APPLICATION_ACTION_NAME,
  REMOVE_USER_APPLICATION_ACTION_NAME,
} from './const';
import { GetServerApplications, GetUserApplications } from './types';

import { ServerApplicationsAPI } from '~/entities/serverApplications/api';
import { ERROR_MESSAGES } from '~/shared/constants';

export const approveServerApplication = createAsyncThunk<
  void,
  { applicationId: string },
  { rejectValue: string }
>(
  APPROVE_SERVER_APPLICATION_ACTION_NAME,
  async ({ applicationId }, { rejectWithValue }) => {
    try {
      await ServerApplicationsAPI.approveApplication(applicationId);
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

export const removeServerApplication = createAsyncThunk<
  void,
  { applicationId: string },
  { rejectValue: string }
>(
  REMOVE_SERVER_APPLICATION_ACTION_NAME,
  async ({ applicationId }, { rejectWithValue }) => {
    try {
      await ServerApplicationsAPI.removeApplicationServer(applicationId);
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

export const removeUserApplication = createAsyncThunk<
  void,
  { applicationId: string },
  { rejectValue: string }
>(
  REMOVE_USER_APPLICATION_ACTION_NAME,
  async ({ applicationId }, { rejectWithValue }) => {
    try {
      await ServerApplicationsAPI.removeApplicationUser(applicationId);
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

export const getServerApplications = createAsyncThunk<
  GetServerApplications,
  { serverId: string; page: number; size: number },
  { rejectValue: string }
>(
  GET_SERVER_APPLICATIONS_ACTION_NAME,
  async ({ serverId, page, size }, { rejectWithValue }) => {
    try {
      const response = await ServerApplicationsAPI.getServerApplications(
        serverId,
        page,
        size,
      );

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

export const getUserApplications = createAsyncThunk<
  GetUserApplications,
  { page: number; size: number },
  { rejectValue: string }
>(
  GET_USER_APPLICATIONS_ACTION_NAME,
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await ServerApplicationsAPI.getUserApplications(
        page,
        size,
      );

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
