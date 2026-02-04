import { MantineStyleProp } from '@mantine/core';

export const stylesVotersListModal = {
  variantName: (): MantineStyleProp => ({
    background: 'rgba(59, 130, 246, 0.1)',
    padding: '2px 8px',
    borderRadius: '6px',
  }),
  modalRoot: () => ({
    content: {
      background: 'linear-gradient(145deg, #1a1b1e 0%, #141517 100%)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    },
    header: {
      background: 'rgba(26, 27, 30, 0.9)',
      borderBottom: '1px solid rgba(59, 130, 246, 0.15)',
      padding: '16px 20px',
    },
    title: {
      color: '#fff',
    },
    body: {
      padding: '16px 20px 20px',
    },
  }),
  userContainer: (index: number): MantineStyleProp => ({
    background:
      index % 2 === 0
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(59, 130, 246, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.2)',
      transform: 'translateX(4px)',
    },
  }),
  noVotesContainer: (): MantineStyleProp => ({
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px dashed rgba(59, 130, 246, 0.3)',
    borderRadius: '12px',
  }),
};
