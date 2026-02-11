import { MantineStyleProp } from '@mantine/core';

export const stylesStreamView = {
  container: (): MantineStyleProp => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#2C2E33',
    overflow: 'hidden',
    minWidth: 0,
  }),
  box: (): MantineStyleProp => ({
    position: 'relative',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: 0,
  }),
};
