import { Button, Collapse, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { ChannelItem } from '~/entities/channels';
import { CreateChannel } from '~/features/channels/createChannel';
import { EditChannel } from '~/features/channels/editChannel';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setUserStreamView } from '~/store/AppStore';
import {
  ChannelType,
  setCurrentNotificationChannelId,
} from '~/store/ServerStore';

export const NotificationChannels = () => {
  const dispatch = useAppDispatch();
  const [opened, { toggle }] = useDisclosure(true);
  const { serverData } = useAppSelector((state) => state.testServerStore);
  const canWorkChannels = serverData.permissions.canWorkChannels;

  const handleOpenChannel = (channelId: string) => {
    dispatch(setCurrentNotificationChannelId(channelId));
    dispatch(setUserStreamView(false));
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
          Каналы оповещения
        </Button>
        {canWorkChannels && (
          <CreateChannel channelType={ChannelType.NOTIFICATION_CHANNEL} />
        )}
      </Group>
      <Collapse in={opened} w="100%">
        <Stack gap="xs">
          {serverData.channels.notificationChannels.map(
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
                    channelType={ChannelType.NOTIFICATION_CHANNEL}
                  />
                }
                channelType={ChannelType.NOTIFICATION_CHANNEL}
              />
            ),
          )}
        </Stack>
      </Collapse>
    </Stack>
  );
};
