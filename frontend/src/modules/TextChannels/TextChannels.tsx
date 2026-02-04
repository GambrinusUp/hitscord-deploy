import { Button, Collapse, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { TextChannelsProps } from './TextChannels.types';

import { ChannelItem } from '~/entities/channels';
import { EditChannel } from '~/features/channels';
import { CreateChannel } from '~/features/channels/createChannel';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setUserStreamView } from '~/store/AppStore';
import { ChannelType, setCurrentChannelId } from '~/store/ServerStore';

export const TextChannels = ({ onClose }: TextChannelsProps) => {
  const dispatch = useAppDispatch();
  const [opened, { toggle }] = useDisclosure(true);
  const { serverData } = useAppSelector((state) => state.testServerStore);
  const canWorkChannels = serverData.permissions.canWorkChannels;

  const handleOpenChannel = (channelId: string) => {
    dispatch(setCurrentChannelId(channelId));
    dispatch(setUserStreamView(false));
    onClose();
  };

  return (
    <Stack align="flex-start" gap="xs">
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
          Текстовые каналы
        </Button>
        {canWorkChannels && (
          <CreateChannel channelType={ChannelType.TEXT_CHANNEL} />
        )}
      </Group>
      <Collapse in={opened} w="100%">
        <Stack gap="xs">
          {serverData.channels.textChannels.map(
            ({ channelId, channelName }) => (
              <ChannelItem
                key={channelId}
                channelId={channelId}
                channelName={channelName}
                openChannel={() => handleOpenChannel(channelId)}
                editAction={
                  <EditChannel
                    channelName={channelName}
                    channelId={channelId}
                    channelType={ChannelType.TEXT_CHANNEL}
                  />
                }
                channelType={ChannelType.TEXT_CHANNEL}
              />
            ),
          )}
        </Stack>
      </Collapse>
    </Stack>
  );
};
