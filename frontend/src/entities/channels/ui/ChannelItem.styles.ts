import { CSSProperties, MantineStyleProp } from '@mantine/core';

export const channelItemStyles = {
  channelBox: (): MantineStyleProp => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 230,
  }),
  buttonRoot: (isHovered: boolean, current: boolean): CSSProperties => ({
    backgroundColor: current ? '#999999' : 'transparent',
    '--button-hover-color': '#4f4f4f',
    transition: 'color 0.3s ease',
    borderTopRightRadius: isHovered ? 0 : 'var(--mantine-radius-default)',
    borderBottomRightRadius: isHovered ? 0 : 'var(--mantine-radius-default)',
  }),
  breakLabel: (): CSSProperties => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    wordBreak: 'break-all',
    maxWidth: '100%',
  }),
};
