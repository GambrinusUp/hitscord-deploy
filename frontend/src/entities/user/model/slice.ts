import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';

import {
  changeNotificationLifetime,
  changeProfileIcon,
  changeSettings,
  changeUserProfile,
  getUserProfile,
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser,
} from './actions';
import { USER_SLICE_NAME } from './const';
import { LoginResponse, SettingType, User, UserState } from './types';

import { LoadingState } from '~/shared';
import { TokenType } from '~/shared/lib/types';
import { loadTokenFromLocalStorage } from '~/shared/lib/utils';

const initialState: UserState = {
  user: {
    id: '',
    name: '',
    tag: '',
    mail: '',
    accontCreateDate: '',
    notifiable: false,
    friendshipApplication: false,
    nonFriendMessage: false,
    icon: null,
    notificationLifeTime: 0,
    systemRoles: []
  },
  accessToken: loadTokenFromLocalStorage(TokenType.ACCESS),
  refreshToken: loadTokenFromLocalStorage(TokenType.REFRESH),
  isLoggedIn: !!loadTokenFromLocalStorage(TokenType.ACCESS),
  error: '',
  loading: LoadingState.IDLE,
};

export const UserSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState,
  reducers: {
    clearTokens: (state) => {
      state.accessToken = '';
      state.refreshToken = '';
      state.isLoggedIn = false;
    },
    clearUserData: (state) => {
      state.user = {
        id: '',
        name: '',
        tag: '',
        mail: '',
        accontCreateDate: '',
        notifiable: false,
        friendshipApplication: false,
        nonFriendMessage: false,
        icon: null,
        notificationLifeTime: 0,
        systemRoles: []
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.error = '';
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem(TokenType.ACCESS, action.payload.accessToken);
          localStorage.setItem(TokenType.REFRESH, action.payload.refreshToken);
          state.isLoggedIn = true;
        },
      )
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          //console.log(action.payload);

          state.error = '';
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem(TokenType.ACCESS, action.payload.accessToken);
          localStorage.setItem(TokenType.REFRESH, action.payload.refreshToken);
          state.isLoggedIn = true;
        },
      )
      .addCase(
        getUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.error = '';
          state.user = action.payload;
        },
      )
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.error = '';
        state.accessToken = '';
        state.refreshToken = '';
        localStorage.setItem(TokenType.ACCESS, '');
        localStorage.setItem(TokenType.REFRESH, '');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.error = action.payload as string;
        state.accessToken = '';
        state.refreshToken = '';
        localStorage.setItem(TokenType.ACCESS, '');
        localStorage.setItem(TokenType.REFRESH, '');
      })
      .addCase(refreshTokens.pending, (state) => {
        state.error = '';
        state.accessToken = '';
        state.refreshToken = '';
        state.loading = LoadingState.PENDING;
      })
      .addCase(
        refreshTokens.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.error = '';
          state.loading = LoadingState.FULFILLED;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem(TokenType.ACCESS, action.payload.accessToken);
          localStorage.setItem(TokenType.REFRESH, action.payload.refreshToken);
        },
      )
      .addCase(refreshTokens.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = LoadingState.REJECTED;
        state.accessToken = '';
        state.refreshToken = '';
        localStorage.setItem(TokenType.ACCESS, '');
        localStorage.setItem(TokenType.REFRESH, '');
        state.isLoggedIn = false;
      })
      .addCase(changeSettings.fulfilled, (state, { meta }) => {
        const { type } = meta.arg;

        switch (type) {
          case SettingType.FRIENDSHIP:
            state.user.friendshipApplication =
              !state.user.friendshipApplication;
            break;
          case SettingType.NONFRIEND:
            state.user.nonFriendMessage = !state.user.nonFriendMessage;
            break;
          case SettingType.NOTIFIABLE:
            state.user.notifiable = !state.user.notifiable;
            break;
        }

        state.error = '';
      })
      .addCase(
        changeUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.error = '';
        },
      )
      .addCase(changeNotificationLifetime.fulfilled, (state, { meta }) => {
        const { time } = meta.arg;

        state.user.notificationLifeTime = time;
        state.error = '';
      })
      .addCase(changeProfileIcon.fulfilled, (state, action) => {
        state.user.icon = action.payload;
        state.error = '';
      })
      .addMatcher(
        isAnyOf(
          changeSettings.pending,
          changeUserProfile.pending,
          logoutUser.pending,
          getUserProfile.pending,
          registerUser.pending,
          changeNotificationLifetime.pending,
          changeProfileIcon.pending,
          loginUser.pending,
        ),
        (state) => {
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          registerUser.rejected,
          loginUser.rejected,
          changeSettings.rejected,
          changeUserProfile.rejected,
          getUserProfile.rejected,
          changeNotificationLifetime.rejected,
          changeProfileIcon.rejected,
        ),
        (state, action) => {
          state.error = action.payload as string;
        },
      );
  },
});

export const { clearTokens, clearUserData } = UserSlice.actions;

export const userReducer = UserSlice.reducer;
