import { MantineStyleProp } from '@mantine/core';

export const messageActionsStyles = {
  editItem: (): MantineStyleProp => ({
    color: 'var(--color-primary)',
    transition: 'all 0.2s ease',
  }),

  deleteItem: (): MantineStyleProp => ({
    color: '#ef4444',
    transition: 'all 0.2s ease',
  }),

  icon: (): MantineStyleProp => ({
    transition: 'transform 0.2s ease',
  }),

  modalContent: (): MantineStyleProp => ({
    backgroundColor: 'var(--color-surface-2)',
    border: '1px solid var(--border-primary-soft)',
  }),
};
