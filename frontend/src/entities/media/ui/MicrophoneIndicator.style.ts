import { MantineStyleProp } from '@mantine/core';

export const stylesMicrophoneIndicator = {
  box: (): MantineStyleProp => ({
    position: 'absolute',
    top: 8,
    left: 8,
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    borderRadius: '6px',
    padding: '6px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    zIndex: 10,
  }),
};
