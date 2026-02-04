import { io, Socket } from 'socket.io-client';

export const socket: Socket = io(import.meta.env.VITE_MEDIA_URL || '');

/*socket.on('connection-success', ({ socketId }: { socketId: string }) => {
  console.log('Connected with socketId', socketId);
});*/
