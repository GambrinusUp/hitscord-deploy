import { MantineStyleProp } from '@mantine/core';

export const stylesUserInfo = {
  name: (): MantineStyleProp => ({
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition: 'color 0.2s ease',
  }),
};
