import { MantineStyleProp } from '@mantine/core';

export const pollItemStyles = {
  breakText: (): MantineStyleProp => ({
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  }),
  card: (): MantineStyleProp => ({
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.1)',
  }),
  box: (disabled: boolean): MantineStyleProp => ({
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    transition: 'background 0.2s ease',
    cursor: disabled ? 'not-allowed' : 'pointer',

    minHeight: 44,
    width: '100%',

    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
  }),
  vote: (usersVotedPercent: number): MantineStyleProp => ({
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: `${usersVotedPercent}%`,
    background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
    opacity: 0.3,
    transition: 'width 0.3s ease',
  }),
};
