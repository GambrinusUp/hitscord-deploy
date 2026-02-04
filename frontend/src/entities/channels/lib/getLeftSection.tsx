import { Badge } from '@mantine/core';
import { Hash, Volume2 } from 'lucide-react';
import React from 'react';

import { ChannelType } from '~/store/ServerStore';

export const getLeftSection = (
  channelType: ChannelType,
  nonReadedCount?: number,
): React.ReactNode => {
  switch (channelType) {
    case ChannelType.TEXT_CHANNEL:
    case ChannelType.NOTIFICATION_CHANNEL:
      return nonReadedCount && nonReadedCount > 0 ? (
        <Badge circle>{nonReadedCount}</Badge>
      ) : (
        <Hash />
      );
    case ChannelType.VOICE_CHANNEL:
      return <Volume2 />;
    default:
      return null;
  }
};
