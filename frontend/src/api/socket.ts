import { io, Socket } from 'socket.io-client';
import { WEBSOCKET_MEDIA_URL } from '~/constants/constants';

const mediaUrl = import.meta.env.VITE_MEDIA_URL || WEBSOCKET_MEDIA_URL || '';

export const socket: Socket = io(mediaUrl, { path: '/mediasoup/socket.io' });

/*socket.on('connection-success', ({ socketId }: { socketId: string }) => {
  console.log('Connected with socketId', socketId);
});*/
socket.on('connect_error', (err: Error) => {
  console.error('Connection Error:', err.message);
});
