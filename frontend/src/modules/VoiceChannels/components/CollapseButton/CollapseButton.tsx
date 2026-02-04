import { Button, Group } from '@mantine/core';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { CollapseButtonProps } from './CollapseButton.types';

import { CreateChannel } from '~/features/channels/createChannel';
import { ChannelType } from '~/store/ServerStore';

export const CollapseButton = ({
  opened,
  toggle,
  canWorkChannels,
}: CollapseButtonProps) => {
  return (
    <Group justify="space-between" w="100%" wrap="nowrap">
      <Button
        leftSection={opened ? <ChevronDown /> : <ChevronRight />}
        variant="transparent"
        onClick={toggle}
        p={0}
        color="#fffff"
        styles={{
          root: {
            '--button-hover-color': '#4f4f4f',
            transition: 'color 0.3s ease',
          },
        }}
      >
        Голосовые каналы
      </Button>
      {canWorkChannels && (
        <CreateChannel channelType={ChannelType.VOICE_CHANNEL} />
      )}
    </Group>
  );
};
