import { MantineStyleProp } from '@mantine/core';

export const stylesVoiceUserCard = {
  card: (isSpeaking: boolean): MantineStyleProp => ({
    background:
      'linear-gradient(135deg, rgba(45, 45, 50, 0.8) 0%, rgba(35, 35, 40, 0.9) 100%)',
    border: isSpeaking
      ? '2px solid rgba(34, 197, 94, 0.6)'
      : '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'default',
    boxShadow: isSpeaking
      ? '0 0 20px rgba(34, 197, 94, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  }),
  previewContainer: (isCompat: boolean): MantineStyleProp => ({
    position: 'relative',
    width: '100%',
    height: isCompat ? '100px' : undefined,
    aspectRatio: '16 / 10',
    background: 'linear-gradient(135deg, #1a1a1f 0%, #0d0d12 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  }),
  video: (): MantineStyleProp => ({
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(45deg, rgba(88, 166, 255, 0.1) 0%, rgba(140, 100, 255, 0.1) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  }),
  badge: (): MantineStyleProp => ({
    position: 'absolute',
    top: 8,
    right: 8,
  }),
  compactCamera: (): MantineStyleProp => ({
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '40%',
    height: '40%',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }),
};
