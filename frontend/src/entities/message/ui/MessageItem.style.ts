import { MantineStyleProp } from '@mantine/core';

export const messageItemStyles = {
  box: (
    isOwnMessage: boolean,
    isEditing: boolean,
    isTagged: boolean | undefined,
  ): MantineStyleProp => ({
    position: 'relative',
    backgroundColor: isOwnMessage ? '#4A90E2' : '#454950',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '10px',
    maxWidth: '75%',
    display: 'flex',
    flexDirection: 'column',
    width: isEditing ? '100%' : 'auto',
    border: isTagged ? '1px solid rgba(250, 204, 21, 0.5)' : 'none',
    boxShadow: isTagged ? '0 0 6px rgba(250, 204, 21, 0.2)' : 'none',
  }),

  breakText: (): MantineStyleProp => ({
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  }),

  meta: (isOwnMessage: boolean): MantineStyleProp => ({
    marginTop: 4,
    fontSize: 12,
    color: isOwnMessage ? '#D1D5DB' : '#9CA3AF',
    alignSelf: 'flex-start',
  }),
};
