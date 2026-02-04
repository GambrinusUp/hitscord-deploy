import { createContext } from 'react';

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
}

export const WebSocketContext = createContext<WebSocketContextType | null>(
  null,
);
