import { MantineStyleProp } from '@mantine/core';

export const notificationChannelsStyles = {
  channelButton: (): MantineStyleProp => ({
    root: {
      '--button-hover-color': '#4f4f4f',
      transition: 'color 0.3s ease',
    },
  }),
};
