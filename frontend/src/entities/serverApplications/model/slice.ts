import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import {
  approveServerApplication,
  getServerApplications,
  getUserApplications,
  removeServerApplication,
  removeUserApplication,
} from './actions';
import { SERVER_APPLICATIONS_SLICE_NAME } from './const';
import { ServerApplicationState } from './types';

import { LoadingState } from '~/shared';

const initialState: ServerApplicationState = {
  serverApplications: [],
  userApplications: [],
  serverApplicationsLoadingState: LoadingState.IDLE,
  userApplicationsLoadingState: LoadingState.IDLE,
  serverPage: 0,
  serverTotal: 0,
  userPage: 0,
  userTotal: 0,
  error: '',
};

export const ServerApplicationsSlice = createSlice({
  name: SERVER_APPLICATIONS_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getServerApplications.pending, (state) => {
        state.serverApplicationsLoadingState = LoadingState.PENDING;
        state.error = '';
      })
      .addCase(getServerApplications.fulfilled, (state, action) => {
        state.serverApplicationsLoadingState = LoadingState.FULFILLED;
        state.error = '';
        state.serverApplications = action.payload.applications;
        state.serverPage = action.payload.page;
        state.serverTotal = action.payload.total;
      })
      .addCase(getServerApplications.rejected, (state, action) => {
        state.serverApplicationsLoadingState = LoadingState.REJECTED;
        state.error = action.payload as string;
      })
      .addCase(getUserApplications.pending, (state) => {
        state.userApplicationsLoadingState = LoadingState.PENDING;
        state.error = '';
      })
      .addCase(getUserApplications.fulfilled, (state, action) => {
        state.userApplicationsLoadingState = LoadingState.FULFILLED;
        state.error = '';
        state.userApplications = action.payload.applications;
        state.userPage = action.payload.page;
        state.userTotal = action.payload.total;
      })
      .addCase(getUserApplications.rejected, (state, action) => {
        state.userApplicationsLoadingState = LoadingState.REJECTED;
        state.error = action.payload as string;
      })
      .addCase(approveServerApplication.fulfilled, (state, { meta }) => {
        const { applicationId } = meta.arg;

        state.serverApplications = state.serverApplications.filter(
          (application) => application.applicationId !== applicationId,
        );
        state.error = '';
      })
      .addCase(removeServerApplication.fulfilled, (state, { meta }) => {
        const { applicationId } = meta.arg;
        state.serverApplications = state.serverApplications.filter(
          (application) => application.applicationId !== applicationId,
        );
        state.error = '';
      })
      .addCase(removeUserApplication.fulfilled, (state, { meta }) => {
        const { applicationId } = meta.arg;
        state.userApplications = state.userApplications.filter(
          (application) => application.applicationId !== applicationId,
        );
        state.error = '';
      })
      .addMatcher(
        isAnyOf(
          approveServerApplication.pending,
          removeServerApplication.pending,
          removeUserApplication.pending,
        ),
        (state) => {
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          approveServerApplication.rejected,
          removeServerApplication.rejected,
          removeUserApplication.rejected,
        ),
        (state, action) => {
          state.error = action.payload as string;
        },
      );
  },
});

export const serverApplicationsReducer = ServerApplicationsSlice.reducer;
