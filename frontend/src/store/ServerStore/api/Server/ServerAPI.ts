import { FileResponse } from '~/entities/files';
import { api } from '~/shared/api';
import {
  BannedUserResponse,
  GetServersResponse,
  ServerData,
} from '~/store/ServerStore';

export const getServers = async (): Promise<GetServersResponse> => {
  const { data } = await api.get('/server/get/List');

  return data;
};

export const getServerData = async (serverId: string): Promise<ServerData> => {
  const { data } = await api.get('/server/getserverdata', {
    params: { serverId },
  });

  return data;
};

export const createServer = async (
  name: string,
  serverType: number,
): Promise<void> => {
  await api.post('/server/create', {
    name,
    serverType,
  });
};

export const deleteServer = async (serverId: string): Promise<void> => {
  await api.delete('/server/delete', {
    data: { serverId },
  });
};

export const changeRole = async (
  serverId: string,
  userId: string,
  role: string,
): Promise<void> => {
  await api.put('/server/changerole', {
    serverId,
    userId,
    role,
  });
};

export const addRole = async (
  serverId: string,
  userId: string,
  role: string,
): Promise<void> => {
  await api.put('/server/addrole', {
    serverId,
    userId,
    role,
  });
};

export const removeRole = async (
  serverId: string,
  userId: string,
  role: string,
): Promise<void> => {
  await api.put('/server/removerole', {
    serverId,
    userId,
    role,
  });
};

export const subscribeToServer = async (
  invitationToken: string,
  userName: string,
): Promise<void> => {
  await api.post('/server/subscribe', {
    invitationToken,
    userName,
  });
};

export const unsubscribeFromServer = async (
  serverId: string,
): Promise<void> => {
  await api.delete('/server/unsubscribe', {
    data: { serverId },
  });
};

export const changeServerName = async (
  serverId: string,
  name: string,
): Promise<void> => {
  await api.put('/server/name/server/change', {
    id: serverId,
    name,
  });
};

export const changeNameOnServer = async (
  serverId: string,
  name: string,
): Promise<void> => {
  await api.put('/server/name/user/change', {
    id: serverId,
    name,
  });
};

export const deleteUserFromServer = async (
  serverId: string,
  userId: string,
  banReason?: string,
): Promise<void> => {
  await api.delete('/server/deleteuser', {
    data: {
      serverId,
      userId,
      banReason,
    },
  });
};

export const creatorUnsubscribeFromServer = async (
  serverId: string,
  newCreatorId: string,
): Promise<void> => {
  await api.delete('/server/unsubscribe/creator', {
    data: {
      serverId,
      newCreatorId,
    },
  });
};

export const getBannedUsers = async (
  serverId: string,
  page: number,
  size: number,
): Promise<BannedUserResponse> => {
  const { data } = await api.get('/server/banned/list', {
    params: { serverId, Page: page, Size: size },
  });

  return data;
};

export const unbanUser = async (
  userId: string,
  serverId: string,
): Promise<void> => {
  await api.delete('/server/banned/unban', {
    data: {
      userId,
      serverId,
    },
  });
};

export const changeServerIcon = async (
  serverId: string,
  icon: File,
): Promise<FileResponse> => {
  const formData = new FormData();
  formData.append('ServerId', serverId);
  formData.append('Icon', icon);

  const { data } = await api.put('/server/icon', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

export const changeServerIsClosed = async (
  serverId: string,
  isClosed: boolean,
  isApprove?: boolean,
): Promise<void> => {
  await api.put('/server/isClosed', {
    serverId,
    isClosed,
    isApprove,
  });
};

export const changeNotifiable = async (serverId: string): Promise<void> => {
  await api.put('/server/settings/nonnotifiable', {
    id: serverId,
  });
};

export const createInvitation = async (
  serverId: string,
  expiredAt: string,
): Promise<{
  invitationString: string;
}> => {
  const { data } = await api.post('/server/invitation/create', {
    serverId,
    expiredAt,
  });

  return data;
};
