import { MantineStyleProp } from '@mantine/core';

export const stylesBotCard = {
  card: (): MantineStyleProp => ({
    height: '100%',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    background:
      'linear-gradient(160deg, rgba(24, 24, 27, 0.96), rgba(16, 16, 20, 0.96))',
  }),
  permissionsWrap: (): MantineStyleProp => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  }),
};
