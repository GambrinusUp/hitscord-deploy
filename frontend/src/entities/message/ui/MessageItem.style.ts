import { MantineStyleProp } from '@mantine/core';

export const messageItemStyles = {
  box: (
    isOwnMessage: boolean,
    isEditing: boolean,
    isTagged: boolean | undefined,
  ): MantineStyleProp => ({
    position: 'relative',
    backgroundColor: isEditing
      ? 'transparent'
      : isOwnMessage
        ? 'var(--color-primary)'
        : 'var(--color-surface-2)',
    color: 'var(--color-white)',
    padding: isEditing ? 0 : '10px 14px',
    borderRadius: '12px',
    maxWidth: '75%',
    display: 'flex',
    flexDirection: 'column',
    width: isEditing ? '100%' : 'auto',
    border: isEditing
      ? 'none'
      : isTagged
        ? '1px solid rgba(250, 204, 21, 0.5)'
        : isOwnMessage
          ? '1px solid var(--border-primary-soft)'
          : '1px solid var(--color-white-05)',
    boxShadow: isEditing
      ? 'none'
      : isTagged
        ? '0 0 8px rgba(250, 204, 21, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'
        : isOwnMessage
          ? '0 2px 8px var(--color-primary-20), 0 1px 2px rgba(0, 0, 0, 0.1)'
          : '0 2px 4px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease',
  }),

  breakText: (): MantineStyleProp => ({
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: '1.5',
  }),

  meta: (isOwnMessage: boolean): MantineStyleProp => ({
    marginTop: 4,
    fontSize: 12,
    color: isOwnMessage
      ? 'rgba(255, 255, 255, 0.8)'
      : 'rgba(255, 255, 255, 0.6)',
    alignSelf: 'flex-start',
  }),

  container: (): MantineStyleProp => ({
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'background-color 0.2s ease',
  }),

  actionButtons: (): MantineStyleProp => ({
    transition: 'all 0.2s ease',
  }),
};
