import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { RolesAPI } from './api';
import {
  ChangeSettings,
  CreateRoleRequest,
  CreateRoleResponse,
  GetRoles,
  UpdateRole,
} from './RolesStore.types';

export const getRoles = createAsyncThunk<
  GetRoles,
  { serverId: string },
  { rejectValue: string }
>('rolesSlice/getRoles', async ({ serverId }, { rejectWithValue }) => {
  try {
    const response = await RolesAPI.getRoles(serverId);

    return response;
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});

export const createRole = createAsyncThunk<
  CreateRoleResponse,
  { role: CreateRoleRequest },
  { rejectValue: string }
>('rolesSlice/createRole', async ({ role }, { rejectWithValue, dispatch }) => {
  try {
    const response = await RolesAPI.createRole(role);

    dispatch(getRoles({ serverId: role.serverId }));

    return response;
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});

export const deleteRole = createAsyncThunk<
  void,
  { serverId: string; roleId: string },
  { rejectValue: string }
>(
  'rolesSlice/deleteRole',
  async ({ serverId, roleId }, { rejectWithValue }) => {
    try {
      await RolesAPI.deleteRole(serverId, roleId);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const updateRole = createAsyncThunk<
  void,
  { updatedRole: UpdateRole },
  { rejectValue: string }
>('rolesSlice/updateRole', async ({ updatedRole }, { rejectWithValue }) => {
  try {
    await RolesAPI.updateRole(updatedRole);
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});

export const updateRoleSettings = createAsyncThunk<
  void,
  { updatedRoleSettings: ChangeSettings },
  { rejectValue: string }
>(
  'rolesSlice/updateRoleSettings',
  async ({ updatedRoleSettings }, { rejectWithValue }) => {
    try {
      await RolesAPI.updateRoleSettings(updatedRoleSettings);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);
