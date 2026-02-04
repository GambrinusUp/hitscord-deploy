import { configureStore } from '@reduxjs/toolkit';

import { AppReducer } from './AppStore';
import { RolesReducer } from './RolesStore';
import { ServerReducer } from './ServerStore';

import { chatsReducer } from '~/entities/chat';
import { filesReducer } from '~/entities/files';
import { friendshipReducer } from '~/entities/friendship';
import { presetsReducer } from '~/entities/presets';
import { serverApplicationsReducer } from '~/entities/serverApplications';
import { subChatReducer } from '~/entities/subChat';
import { userReducer } from '~/entities/user';

const store = configureStore({
  reducer: {
    userStore: userReducer,
    appStore: AppReducer,
    testServerStore: ServerReducer,
    chatsStore: chatsReducer,
    rolesStore: RolesReducer,
    filesStore: filesReducer,
    friendshipStore: friendshipReducer,
    subChatStore: subChatReducer,
    presetsStore: presetsReducer,
    serverApplicationsStore: serverApplicationsReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
