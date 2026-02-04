import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  CREATE_PRESET_ACTION_NAME,
  DELETE_PRESET_ACTION_NAME,
  GET_PRESETS_ACTION_NAME,
  GET_SYSTEM_ROLES_ACTION_NAME,
} from './const';
import { GetPresets, GetSystemRoles, Preset, PresetDto } from './types';

import { PresetsAPI } from '~/entities/presets/api';
import { ERROR_MESSAGES } from '~/shared/constants';

export const getSystemRoles = createAsyncThunk<
  GetSystemRoles,
  { serverId: string },
  { rejectValue: string }
>(GET_SYSTEM_ROLES_ACTION_NAME, async ({ serverId }, { rejectWithValue }) => {
  try {
    const response = await PresetsAPI.getSystemRoles(serverId);

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

export const getPresets = createAsyncThunk<
  GetPresets,
  { serverId: string },
  { rejectValue: string }
>(GET_PRESETS_ACTION_NAME, async ({ serverId }, { rejectWithValue }) => {
  try {
    const response = await PresetsAPI.getPresets(serverId);

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

export const createPreset = createAsyncThunk<
  Preset,
  PresetDto,
  { rejectValue: string }
>(
  CREATE_PRESET_ACTION_NAME,
  async ({ serverId, serverRoleId, systemRoleId }, { rejectWithValue }) => {
    try {
      const response = await PresetsAPI.createPreset(
        serverId,
        serverRoleId,
        systemRoleId,
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

export const deletePreset = createAsyncThunk<
  void,
  PresetDto,
  { rejectValue: string }
>(
  DELETE_PRESET_ACTION_NAME,
  async ({ serverId, serverRoleId, systemRoleId }, { rejectWithValue }) => {
    try {
      await PresetsAPI.deletePreset(serverId, serverRoleId, systemRoleId);
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
