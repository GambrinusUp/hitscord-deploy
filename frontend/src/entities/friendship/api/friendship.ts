import {
  APPROVE_APPLICATION,
  CREATE_APPLICATION,
  DECLINE_APPLICATION,
  DELETE_APPLICATION,
  DELETE_FRIENDSHIP,
  GET_APPLICATION_FROM,
  GET_APPLICATION_TO,
  GET_FRIENDSHIP_LIST,
} from './const';

import { GetApplication, GetFriends } from '~/entities/friendship/model/types';
import { api } from '~/shared/api';

export const createApplication = async (userTag: string): Promise<void> => {
  await api.post(CREATE_APPLICATION, {
    userTag,
  });
};

export const getApplicationFrom = async (): Promise<GetApplication> => {
  const { data } = await api.get(GET_APPLICATION_FROM);

  return data;
};

export const getApplicationTo = async (): Promise<GetApplication> => {
  const { data } = await api.get(GET_APPLICATION_TO);

  return data;
};

export const deleteApplication = async (
  applicationId: string,
): Promise<void> => {
  await api.delete(DELETE_APPLICATION, {
    data: { applicationId },
  });
};

export const declineApplication = async (
  applicationId: string,
): Promise<void> => {
  await api.delete(DECLINE_APPLICATION, {
    data: { applicationId },
  });
};

export const approveApplication = async (
  applicationId: string,
): Promise<void> => {
  await api.post(APPROVE_APPLICATION, {
    applicationId,
  });
};

export const deleteFriendship = async (userId: string): Promise<void> => {
  await api.delete(DELETE_FRIENDSHIP(userId));
};

export const getFriendshipList = async (): Promise<GetFriends> => {
  const { data } = await api.get(GET_FRIENDSHIP_LIST);

  return data;
};
