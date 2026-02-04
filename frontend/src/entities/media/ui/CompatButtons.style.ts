import { MantineStyleProp } from '@mantine/core';

export const stylesCompatButtons = {
  container: (hovered: boolean): MantineStyleProp => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '6px',
    opacity: hovered ? 1 : 0,
    transition: 'opacity 0.2s ease',
  }),
};
