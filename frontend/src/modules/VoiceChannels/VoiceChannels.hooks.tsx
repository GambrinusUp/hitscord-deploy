import { useEffect, useState } from 'react';

import { ActiveUser } from './VoiceChannels.types';

import { socket } from '~/api/socket';

export const useActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.on(
      'active-speakers',
      ({ activeSpeakers }: { activeSpeakers: ActiveUser[] }) => {
        setActiveUsers(activeSpeakers);
      },
    );

    return () => {
      socket.off('active-speakers');
    };
  }, []);

  return activeUsers;
};
