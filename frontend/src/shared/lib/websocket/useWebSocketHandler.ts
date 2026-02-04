import { useContext } from 'react';

import { WebSocketContext } from '~/shared/providers/websocket';

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);

  if (!ctx) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }

  return ctx;
};
