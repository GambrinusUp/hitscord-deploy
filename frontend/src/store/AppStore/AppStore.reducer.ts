import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppSettingsState } from './AppStore.types';

const initialState: AppSettingsState = {
  isUserStreamView: false,
  isOpenHome: true,
};

const AppSettingsSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleUserStreamView(state) {
      state.isUserStreamView = !state.isUserStreamView;
    },
    setUserStreamView(state, action: PayloadAction<boolean>) {
      state.isUserStreamView = action.payload;
    },
    setOpenHome(state, action: PayloadAction<boolean>) {
      state.isOpenHome = action.payload;
    },
    // toggleDarkMode(state) {
    //   state.isDarkMode = !state.isDarkMode;
    // },
    // setLanguage(state, action: PayloadAction<string>) {
    //   state.language = action.payload;
    // },
  },
});

export const { toggleUserStreamView, setUserStreamView, setOpenHome } =
  AppSettingsSlice.actions;

export const AppReducer = AppSettingsSlice.reducer;
