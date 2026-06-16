import type { AuthState } from './types';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { AUTH_SLICE_NAME } from './const';

import { loadTokenFromLocalStorage } from '~/shared';

const initialState: AuthState = {
  accessToken: loadTokenFromLocalStorage('accessToken'),
  isLoggedIn: !!loadTokenFromLocalStorage('accessToken'),
  error: '',
  loading: 'idle',
};

export const AuthSlice = createSlice({
  name: AUTH_SLICE_NAME,
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isLoggedIn = true;
    },
    clearTokens: (state) => {
      state.accessToken = '';
      state.isLoggedIn = false;
    },
  },
});

export const { setToken, clearTokens } = AuthSlice.actions;

export const authReducer = AuthSlice.reducer;
