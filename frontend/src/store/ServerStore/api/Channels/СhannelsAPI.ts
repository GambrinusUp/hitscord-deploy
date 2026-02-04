import { api } from '~/shared/api';
import {
  ChannelSettings,
  ChannelType,
  GetChannelSettings,
} from '~/store/ServerStore';
import { GetMessage } from '~/store/ServerStore/ServerStore.types';

export const getChannelsMessages = async (
  channelId: string,
  number: number,
  fromMessageId: number,
  down: boolean,
): Promise<GetMessage> => {
  const { data } = await api.get('/channel/messages', {
    params: { channelId, number, fromMessageId, down },
  });

  return data;
};

export const createChannel = async (
  serverId: string,
  name: string,
  channelType: ChannelType,
  maxCount?: number,
): Promise<void> => {
  await api.post('/channel/create', {
    serverId,
    name,
    channelType,
    maxCount,
  });
};

export const deleteChannel = async (channelId: string): Promise<void> => {
  await api.delete('/channel/delete', {
    data: { channelId },
  });
};

export const changeChannelName = async (
  id: string,
  name: string,
): Promise<void> => {
  await api.put('/channel/name/change', {
    id,
    name,
  });
};

export const selfMute = async (): Promise<void> => {
  await api.put('/channel/voice/mute/self');
};

export const changeTextChannelSettings = async (
  settings: ChannelSettings,
): Promise<void> => {
  await api.post('/channel/settings/change/text', settings);
};

export const changeNotificationChannelSettings = async (
  settings: ChannelSettings,
): Promise<void> => {
  await api.post('/channel/settings/change/notification', settings);
};

export const changeVoiceChannelSettings = async (
  settings: ChannelSettings,
): Promise<void> => {
  await api.post('/channel/settings/change/voice', settings);
};

export const getChannelSettings = async (
  channelId: string,
): Promise<GetChannelSettings> => {
  const { data } = await api.get('/channel/settings', {
    params: { channelId },
  });

  return data;
};

export const changeVoiceChannelMaxCount = async (
  voiceChannelId: string,
  maxCount: number,
): Promise<void> => {
  await api.put('/channel/settings/maxcount', {
    voiceChannelId,
    maxCount,
  });
};

export const changeChannelNotifiable = async (
  channelId: string,
): Promise<void> => {
  await api.put('/channel/settings/nonnotifiable', {
    id: channelId,
  });
};

export const changeSubChannelSettings = async (
  settings: ChannelSettings,
): Promise<void> => {
  await api.post('/channel/settings/change/sub', settings);
};
