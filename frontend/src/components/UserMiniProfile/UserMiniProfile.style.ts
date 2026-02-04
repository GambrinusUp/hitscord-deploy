import { MantineStyleProp } from '@mantine/core';

export const stylesUserMiniProfile = {
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
    cursor: 'default',
  }),
  userTag: (): MantineStyleProp => ({
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
    cursor: 'default',
  }),
  roleName: (): MantineStyleProp => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  }),
};
