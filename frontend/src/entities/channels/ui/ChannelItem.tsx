import { Box, Button, Tooltip } from '@mantine/core';
import { useState } from 'react';

import { channelItemStyles } from './ChannelItem.styles';

import { getLeftSection } from '~/entities/channels/lib/getLeftSection';
import { useChannelData } from '~/entities/channels/lib/useChannelData';
import { useAppSelector } from '~/hooks';
import { ChannelType } from '~/store/ServerStore';

interface ChannelItemProps {
  channelId: string;
  channelName: string;
  openChannel: () => void;
  editAction: React.ReactNode;
  channelType: ChannelType;
  maxCount?: number;
  currentCount?: number;
}

export const ChannelItem = ({
  channelId,
  channelName,
  openChannel,
  editAction,
  channelType,
  maxCount,
  currentCount,
}: ChannelItemProps) => {
  const { serverData, currentChannelId, currentNotificationChannelId } =
    useAppSelector((state) => state.testServerStore);
  const channelData = useChannelData(channelId, channelType);

  const canWorkChannels = serverData.permissions.canWorkChannels;
  const nonReadedCount = channelData.channelData?.nonReadedCount || 0;

  const [isHovered, setIsHovered] = useState('');

  return (
    <Tooltip label={channelName}>
      <Box
        key={channelId}
        style={channelItemStyles.channelBox()}
        onMouseEnter={() => setIsHovered(channelId)}
        onMouseLeave={() => setIsHovered('')}
      >
        <Button
          leftSection={getLeftSection(channelType, nonReadedCount)}
          rightSection={
            channelType === ChannelType.VOICE_CHANNEL
              ? `${currentCount}/${maxCount}`
              : undefined
          }
          variant="subtle"
          p={0}
          color="#ffffff"
          justify="flex-start"
          styles={{
            root: channelItemStyles.buttonRoot(
              isHovered === channelId,
              currentChannelId === channelId ||
                currentNotificationChannelId === channelId,
            ),
            label: channelItemStyles.breakLabel(),
          }}
          fullWidth
          onClick={openChannel}
        >
          {channelName}
        </Button>
        {isHovered === channelId &&
          !(
            canWorkChannels === false &&
            channelType === ChannelType.VOICE_CHANNEL
          ) &&
          editAction}
      </Box>
    </Tooltip>
  );
};
