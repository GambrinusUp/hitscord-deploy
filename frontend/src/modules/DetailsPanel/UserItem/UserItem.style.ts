import { MantineStyleProp } from '@mantine/core';

export const userItemStyles = {
  group: (): MantineStyleProp => ({
    width: '100%',
    overflow: 'hidden',
    cursor: 'pointer',
    flexWrap: 'nowrap',
  }),
  userName: (): MantineStyleProp => ({
    flex: 1,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    lineHeight: '1.2em',
    maxHeight: '2.4em',
    wordBreak: 'break-word',
  }),
  badge: (): MantineStyleProp => ({
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  }),
};
