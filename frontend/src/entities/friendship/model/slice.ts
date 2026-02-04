import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';

import {
  approveApplication,
  createApplication,
  declineApplication,
  deleteApplication,
  deleteFriendship,
  getApplicationsFrom,
  getApplicationsTo,
  getFriendshipList,
} from './actions';
import { FRIENDSHIP_SLICE_NAME } from './const';
import { Application, FriendshipState } from './types';

import { LoadingState } from '~/shared';

const initialState: FriendshipState = {
  applicationFrom: [],
  applicationTo: [],
  friendshipList: [],
  error: '',
  loading: LoadingState.IDLE,
};

export const FriendshipSlice = createSlice({
  name: FRIENDSHIP_SLICE_NAME,
  initialState,
  reducers: {
    addApplicationTo: (state, action: PayloadAction<Application>) => {
      state.applicationTo.push(action.payload);
    },
    addApplicationFrom: (state, action: PayloadAction<Application>) => {
      state.applicationFrom.push(action.payload);
    },
    removeApplicationFrom: (state, action: PayloadAction<string>) => {
      state.applicationFrom = state.applicationFrom.filter(
        (application) => application.id !== action.payload,
      );
    },
    removeApplicationTo: (state, action: PayloadAction<string>) => {
      state.applicationTo = state.applicationTo.filter(
        (application) => application.id !== action.payload,
      );
    },
    approveApplicationTo: (state, action: PayloadAction<Application>) => {
      const { user } = action.payload;
      state.friendshipList.push(user);
    },
    approveApplicationFrom: (state, action: PayloadAction<Application>) => {
      const { user } = action.payload;

      state.applicationFrom = state.applicationFrom.filter(
        (application) => application.id !== action.payload.id,
      );

      state.friendshipList.push(user);
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      state.friendshipList = state.friendshipList.filter(
        (friend) => friend.userId !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getApplicationsFrom.fulfilled, (state, action) => {
        state.applicationFrom = action.payload.applications;
        state.error = '';
      })
      .addCase(getApplicationsTo.fulfilled, (state, action) => {
        state.applicationTo = action.payload.applications;
        state.error = '';
      })
      .addCase(approveApplication.fulfilled, (state, { meta }) => {
        const applicationId = meta.arg.applicationId;
        state.applicationTo = state.applicationTo.filter(
          (application) => application.id !== applicationId,
        );
        state.error = '';
      })
      .addCase(declineApplication.fulfilled, (state, { meta }) => {
        const applicationId = meta.arg.applicationId;
        state.applicationTo = state.applicationTo.filter(
          (application) => application.id !== applicationId,
        );
        state.error = '';
      })
      .addCase(deleteApplication.fulfilled, (state, { meta }) => {
        const applicationId = meta.arg.applicationId;
        state.applicationFrom = state.applicationFrom.filter(
          (application) => application.id !== applicationId,
        );
        state.error = '';
      })
      .addCase(getFriendshipList.fulfilled, (state, action) => {
        state.friendshipList = action.payload.users;
        state.error = '';
      })
      .addCase(deleteFriendship.fulfilled, (state, { meta }) => {
        const userId = meta.arg.userId;
        state.friendshipList = state.friendshipList.filter(
          (friend) => friend.userId !== userId,
        );
        state.error = '';
      })
      .addMatcher(
        isAnyOf(
          createApplication.fulfilled,
          createApplication.pending,
          getApplicationsFrom.pending,
          getApplicationsTo.pending,
          approveApplication.pending,
          declineApplication.pending,
          deleteApplication.pending,
          getFriendshipList.pending,
          deleteFriendship.pending,
        ),
        (state) => {
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          createApplication.rejected,
          getApplicationsFrom.rejected,
          getApplicationsTo.rejected,
          approveApplication.rejected,
          declineApplication.rejected,
          deleteApplication.rejected,
          getFriendshipList.rejected,
          deleteFriendship.rejected,
        ),
        (state, action) => {
          state.error = action.payload as string;
        },
      );
  },
});

export const {
  addApplicationTo,
  addApplicationFrom,
  removeApplicationFrom,
  removeApplicationTo,
  approveApplicationTo,
  approveApplicationFrom,
  removeFriend,
} = FriendshipSlice.actions;

export const friendshipReducer = FriendshipSlice.reducer;
