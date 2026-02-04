import { api } from '~/shared/api';
import {
  ChangeSettings,
  CreateRoleRequest,
  CreateRoleResponse,
  GetRoles,
  UpdateRole,
} from '~/store/RolesStore/RolesStore.types';

export const getRoles = async (serverId: string): Promise<GetRoles> => {
  const { data } = await api.get('/roles/list', {
    params: { serverId },
  });

  return data;
};

export const createRole = async (
  role: CreateRoleRequest,
): Promise<CreateRoleResponse> => {
  const { data } = await api.post('/roles/create', role);

  return data;
};

export const deleteRole = async (
  serverId: string,
  roleId: string,
): Promise<void> => {
  await api.delete('/roles/delete', {
    data: { serverId, roleId },
  });
};

export const updateRole = async (updatedRole: UpdateRole): Promise<void> => {
  await api.put('/roles/update', updatedRole);
};

export const updateRoleSettings = async (
  updatedRoleSettings: ChangeSettings,
): Promise<void> => {
  await api.put('/roles/settings', updatedRoleSettings);
};
