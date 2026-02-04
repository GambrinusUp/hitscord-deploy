import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import {
  createPreset,
  deletePreset,
  getPresets,
  getSystemRoles,
} from './actions';
import { PRESETS_SLICE_NAME } from './const';
import { PresetsState } from './types';

import { LoadingState } from '~/shared';

const initialState: PresetsState = {
  presets: [],
  systemRoles: [],
  presetsLoading: LoadingState.IDLE,
  systemRolesLoading: LoadingState.IDLE,
  error: '',
};

export const PresetsSlice = createSlice({
  name: PRESETS_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSystemRoles.pending, (state) => {
        state.systemRolesLoading = LoadingState.PENDING;
        state.error = '';
      })
      .addCase(getSystemRoles.fulfilled, (state, action) => {
        state.systemRoles = action.payload.roles;
        state.systemRolesLoading = LoadingState.FULFILLED;
        state.error = '';
      })
      .addCase(getSystemRoles.rejected, (state, action) => {
        state.systemRolesLoading = LoadingState.REJECTED;
        state.error = action.payload as string;
      })
      .addCase(getPresets.pending, (state) => {
        state.presetsLoading = LoadingState.PENDING;
        state.error = '';
      })
      .addCase(getPresets.fulfilled, (state, action) => {
        state.presetsLoading = LoadingState.FULFILLED;
        state.presets = action.payload.presets;
        state.error = '';
      })
      .addCase(getPresets.rejected, (state, action) => {
        state.presetsLoading = LoadingState.REJECTED;
        state.error = action.payload as string;
      })
      .addCase(deletePreset.fulfilled, (state, { meta }) => {
        const { serverRoleId, systemRoleId } = meta.arg;

        state.presets = state.presets.filter(
          (preset) =>
            preset.serverRoleId !== serverRoleId &&
            preset.systemRoleId !== systemRoleId,
        );

        state.error = '';
      })
      .addCase(createPreset.fulfilled, (state, action) => {
        state.presets = [...state.presets, action.payload];
        state.error = '';
      })
      .addMatcher(
        isAnyOf(
          createPreset.pending,
          deletePreset.pending,
          createPreset.fulfilled,
          deletePreset.fulfilled,
        ),
        (state) => {
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(createPreset.rejected, deletePreset.rejected),
        (state, action) => {
          state.error = action.payload as string;
        },
      );
  },
});

export const presetsReducer = PresetsSlice.reducer;
