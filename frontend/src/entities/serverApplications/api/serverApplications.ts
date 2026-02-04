import type {
  GetServerApplications,
  GetUserApplications,
} from '~/entities/serverApplications/model/types';

import {
  APPROVE_APPLICATION,
  GET_SERVER_APPLICATIONS,
  GET_USER_APPLICATIONS,
  REMOVE_SERVER_APPLICATION,
  REMOVE_USER_APPLICATION,
} from './const';

import { api } from '~/shared/api';

export const approveApplication = async (
  applicationId: string,
): Promise<void> => {
  await api.post(APPROVE_APPLICATION, {
    id: applicationId,
  });
};

export const removeApplicationServer = async (
  applicationId: string,
): Promise<void> => {
  await api.delete(REMOVE_SERVER_APPLICATION, {
    data: {
      id: applicationId,
    },
  });
};

export const removeApplicationUser = async (
  applicationId: string,
): Promise<void> => {
  await api.delete(REMOVE_USER_APPLICATION, {
    data: {
      id: applicationId,
    },
  });
};

export const getServerApplications = async (
  serverId: string,
  page: number,
  size: number,
): Promise<GetServerApplications> => {
  const { data } = await api.get(GET_SERVER_APPLICATIONS(serverId, page, size));

  return data;
};

export const getUserApplications = async (
  page: number,
  size: number,
): Promise<GetUserApplications> => {
  const { data } = await api.get(GET_USER_APPLICATIONS(page, size));

  return data;
};
