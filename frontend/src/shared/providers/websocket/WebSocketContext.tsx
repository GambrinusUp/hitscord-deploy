import { createContext } from 'react';

import { AddReaction, RemoveReaction } from '~/entities/reactions';
import { Vote } from '~/entities/vote';
import {
  CreateMessageWs,
  DeleteMessageWs,
  EditMessageWs,
  ReadMessageWs,
} from '~/store/ServerStore';

interface WebSocketContextType {
  sendMessage: (message: CreateMessageWs) => void;
  editMessage: (message: EditMessageWs) => void;
  deleteMessage: (message: DeleteMessageWs) => void;
  sendChatMessage: (message: CreateMessageWs) => void;
  editChatMessage: (message: EditMessageWs) => void;
  deleteChatMessage: (message: DeleteMessageWs) => void;
  readMessage: (message: ReadMessageWs) => void;
  vote: (voteData: Vote) => void;
  unVote: (voteData: Vote) => void;
  addReaction: (reaction: AddReaction, type: 'channel' | 'chat') => void;
  removeReaction: (reaction: RemoveReaction, type: 'channel' | 'chat') => void;
}

export const WebSocketContext = createContext<WebSocketContextType | null>(
  null,
);
