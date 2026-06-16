import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '~/entities/auth';

const store = configureStore({
  reducer: {
    authStore: authReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
