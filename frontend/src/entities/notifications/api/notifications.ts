import { DELETE_NOTIFICATION, GET_NOTIFICATIONS, READ_NOTIFICATION } from './const';

import {
  NotificationListResponse,
  NotificationQueryParams,
} from '../model/types';

import { api } from '~/shared/api';

export const getNotifications = async ({
  page,
  size,
}: NotificationQueryParams): Promise<NotificationListResponse> => {
  const { data } = await api.get<NotificationListResponse>(GET_NOTIFICATIONS, {
    params: {
      Page: page,
      Size: size,
    },
  });

  return data;
};

export const readNotification = async (id: string): Promise<void> => {
  await api.put(READ_NOTIFICATION, { id });
};

export const deleteNotification = async (id: string): Promise<void> => {
  await api.delete(DELETE_NOTIFICATION, {
    data: { id },
  });
};
