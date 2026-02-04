import { MantineStyleProp } from '@mantine/core';
import { CSSProperties } from 'react';

export const stylesStream = {
  container: (): MantineStyleProp => ({
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '8px',
    marginBottom: '10px',
  }),
  video: (): CSSProperties => ({
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    backgroundColor: '#000',
  }),
  controls: (): MantineStyleProp => ({
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    zIndex: 10,
    gap: '8px',
  }),
  volumeControl: (): MantineStyleProp => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '8px 12px',
    borderRadius: '6px',
    minWidth: '200px',
  }),
  volumeSlider: (): CSSProperties => ({
    flex: 1,
  }),
  button: (): MantineStyleProp => ({
    width: '100%',
  }),
};
