import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ATTACH_FILE_ACTION_NAME, REMOVE_FILE_ACTION_NAME } from './const';
import { AttachFileRequest, FileResponse } from './types';

import { FilesAPI } from '~/entities/files/api';
import { ERROR_MESSAGES } from '~/shared/constants';

export const attachFile = createAsyncThunk<
  FileResponse,
  AttachFileRequest,
  { rejectValue: string }
>(ATTACH_FILE_ACTION_NAME, async ({ channelId, file }, { rejectWithValue }) => {
  try {
    const response = await FilesAPI.attachFile(channelId, file);

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

export const removeFile = createAsyncThunk<
  void,
  { fileId: string },
  { rejectValue: string }
>(REMOVE_FILE_ACTION_NAME, async ({ fileId }, { rejectWithValue }) => {
  try {
    await FilesAPI.removeFile(fileId);
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(
        e.response?.data?.message || ERROR_MESSAGES.DEFAULT,
      );
    }

    return rejectWithValue(ERROR_MESSAGES.DEFAULT);
  }
});
