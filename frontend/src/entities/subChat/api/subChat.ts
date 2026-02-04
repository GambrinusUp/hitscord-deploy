import { GetSubChatMessages } from '~/entities/subChat/model/types';
import { api } from '~/shared/api';

export const getSubChatMessages = async (
  channelId: string,
  number: number,
  fromMessageId: number,
  down: boolean,
): Promise<GetSubChatMessages> => {
  const { data } = await api.get('/channel/messages', {
    params: { channelId, number, fromMessageId, down },
  });

  return data;
};
