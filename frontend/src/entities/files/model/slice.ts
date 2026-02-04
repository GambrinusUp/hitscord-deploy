import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { attachFile, removeFile } from './actions';
import { FILES_SLICE_NAME } from './const';
import { FileResponse, FilesState } from './types';

import { LoadingState } from '~/shared';

const initialState: FilesState = {
  uploadedFiles: [],
  loading: LoadingState.IDLE,
  error: '',
};

export const FilesSlice = createSlice({
  name: FILES_SLICE_NAME,
  initialState,
  reducers: {
    clearFiles: (state) => {
      state.uploadedFiles = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(attachFile.pending, (state) => {
        state.loading = LoadingState.PENDING;
        state.error = '';
      })
      .addCase(
        attachFile.fulfilled,
        (state, action: PayloadAction<FileResponse>) => {
          state.loading = LoadingState.FULFILLED;
          state.uploadedFiles = [...state.uploadedFiles, action.payload];
          state.error = '';
        },
      )
      .addCase(attachFile.rejected, (state, action) => {
        state.loading = LoadingState.REJECTED;
        state.error = action.payload as string;
      })
      .addCase(removeFile.pending, (state) => {
        state.error = '';
      })
      .addCase(removeFile.fulfilled, (state, { meta }) => {
        const { fileId } = meta.arg;
        state.uploadedFiles = state.uploadedFiles.filter(
          (file) => file.fileId !== fileId,
        );
        state.error = '';
      })
      .addCase(removeFile.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearFiles } = FilesSlice.actions;

export const filesReducer = FilesSlice.reducer;
