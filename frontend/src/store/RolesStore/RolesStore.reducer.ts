import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';

import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
  updateRoleSettings,
} from './RolesStore.actions';
import {
  CreateRoleResponse,
  GetRoles,
  Role,
  RolesState,
  Setting,
} from './RolesStore.types';

import { LoadingState } from '~/shared';

const initialState: RolesState = {
  rolesList: [],
  rolesLoading: LoadingState.IDLE,
  role: null,
  error: '',
};

export const RolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    setEditedRole: (state, action: PayloadAction<Role | null>) => {
      state.role = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoles.pending, (state) => {
        state.rolesLoading = LoadingState.PENDING;
        state.error = '';
      })
      .addCase(getRoles.fulfilled, (state, action: PayloadAction<GetRoles>) => {
        state.rolesList = action.payload.roles;
        state.rolesLoading = LoadingState.FULFILLED;
        state.error = '';
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.rolesLoading = LoadingState.REJECTED;
        state.error = action.payload as string;
      })

      .addCase(deleteRole.fulfilled, (state, { meta }) => {
        const { roleId } = meta.arg;
        state.rolesList = state.rolesList.filter(
          (role) => role.role.id !== roleId,
        );
        state.error = '';
      })

      .addCase(
        createRole.fulfilled,
        (state, action: PayloadAction<CreateRoleResponse>) => {
          const newRole = {
            role: action.payload,
            settings: {
              canChangeRole: false,
              canWorkChannels: false,
              canDeleteUsers: false,
              canMuteOther: false,
              canDeleteOthersMessages: false,
              canIgnoreMaxCount: false,
              canCreateRoles: false,
              canCreateLessons: false,
              canCheckAttendance: false,
              canUseInvitations: false,
            },
          } as Role;
          state.rolesList.push(newRole);
          state.error = '';
        },
      )

      .addCase(updateRoleSettings.fulfilled, (state, { meta }) => {
        const { updatedRoleSettings } = meta.arg;
        const { roleId, setting, add } = updatedRoleSettings;

        const roleIndex = state.rolesList.findIndex(
          (role) => role.role.id === roleId,
        );

        if (roleIndex !== -1) {
          const updatedSettings = { ...state.rolesList[roleIndex].settings };

          switch (setting) {
            case Setting.CanChangeRole:
              updatedSettings.canChangeRole = add;
              break;
            case Setting.CanWorkChannels:
              updatedSettings.canWorkChannels = add;
              break;
            case Setting.CanDeleteUsers:
              updatedSettings.canDeleteUsers = add;
              break;
            case Setting.CanMuteOther:
              updatedSettings.canMuteOther = add;
              break;
            case Setting.CanDeleteOthersMessages:
              updatedSettings.canDeleteOthersMessages = add;
              break;
            case Setting.CanIgnoreMaxCount:
              updatedSettings.canIgnoreMaxCount = add;
              break;
            case Setting.CanCreateRole:
              updatedSettings.canCreateRoles = add;
              break;
            case Setting.CanCreateLessons:
              updatedSettings.canCreateLessons = add;
              break;
            case Setting.CanCheckAttendance:
              updatedSettings.canCheckAttendance = add;
              break;
            case Setting.CanUseInvitations:
              updatedSettings.canUseInvitations = add;
              break;
            default:
              console.warn('Unknown setting:', setting);
              break;
          }

          state.rolesList[roleIndex].settings = updatedSettings;
        }

        if (state.role && state.role.role.id === roleId) {
          const updatedSettings = { ...state.role.settings };

          switch (setting) {
            case Setting.CanChangeRole:
              updatedSettings.canChangeRole = add;
              break;
            case Setting.CanWorkChannels:
              updatedSettings.canWorkChannels = add;
              break;
            case Setting.CanDeleteUsers:
              updatedSettings.canDeleteUsers = add;
              break;
            case Setting.CanMuteOther:
              updatedSettings.canMuteOther = add;
              break;
            case Setting.CanDeleteOthersMessages:
              updatedSettings.canDeleteOthersMessages = add;
              break;
            case Setting.CanIgnoreMaxCount:
              updatedSettings.canIgnoreMaxCount = add;
              break;
            case Setting.CanCreateRole:
              updatedSettings.canCreateRoles = add;
              break;
            case Setting.CanCreateLessons:
              updatedSettings.canCreateLessons = add;
              break;
            case Setting.CanCheckAttendance:
              updatedSettings.canCheckAttendance = add;
              break;
            case Setting.CanUseInvitations:
              updatedSettings.canUseInvitations = add;
              break;
            default:
              console.warn('Unknown setting:', setting);
              break;
          }

          state.role.settings = updatedSettings;
        }

        state.error = '';
      })

      .addCase(updateRole.fulfilled, (state, { meta }) => {
        const { updatedRole } = meta.arg;

        const roleIndex = state.rolesList.findIndex(
          (role) => role.role.id === updatedRole.roleId,
        );

        if (roleIndex !== -1) {
          state.rolesList[roleIndex] = {
            ...state.rolesList[roleIndex],
            role: {
              ...state.rolesList[roleIndex].role,
              name: updatedRole.name,
              color: updatedRole.color,
            },
          };
        }

        if (state.role && state.role.role.id === updatedRole.roleId) {
          state.role = {
            ...state.role,
            role: {
              ...state.role.role,
              name: updatedRole.name,
              color: updatedRole.color,
            },
          };
        }

        state.error = '';
      })

      .addMatcher(
        isAnyOf(
          createRole.pending,
          deleteRole.pending,
          updateRole.pending,
          updateRoleSettings.pending,
        ),
        (state) => {
          state.error = '';
        },
      )
      /*.addMatcher(isAnyOf(createRole.fulfilled), (state) => {
        state.error = '';
      })*/
      .addMatcher(
        isAnyOf(
          createRole.rejected,
          deleteRole.rejected,
          updateRole.rejected,
          updateRoleSettings.rejected,
        ),
        (state, action) => {
          state.error = action.payload as string;
        },
      );
  },
});

export const { setEditedRole } = RolesSlice.actions;

export const RolesReducer = RolesSlice.reducer;
