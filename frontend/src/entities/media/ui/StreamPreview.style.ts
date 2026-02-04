import { MantineStyleProp } from '@mantine/core';
import { CSSProperties } from 'react';

export const stylesStreamPreview = {
  container: (): MantineStyleProp => ({
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  }),
  video: (): CSSProperties => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }),
  badge: (): MantineStyleProp => ({
    position: 'absolute',
    top: 8,
    right: 8,
  }),
};
