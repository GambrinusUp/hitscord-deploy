import { MantineStyleProp } from '@mantine/core';

export const stylesControlPanel = {
  container: (): MantineStyleProp => ({
    backgroundColor: '#1A1B1E',
    borderTop: '1px solid #2C2E33',
    borderRadius: '8px',
    maxWidth: '100%',
    boxSizing: 'border-box',
  }),
  badge: (): MantineStyleProp => ({
    backgroundColor: '#25262B',
    color: '#A0A0A0',
    border: '1px solid #373A40',
    cursor: 'pointer',
  }),
  microphoneIcon: (isMuted: boolean): MantineStyleProp => ({
    backgroundColor: isMuted ? '#FA5252' : '#2C2E33',
    color: '#FFFFFF',
    border: 'none',
  }),
  cameraIcon: (isCameraOn: boolean): MantineStyleProp => ({
    backgroundColor: isCameraOn ? '#228BE6' : '#2C2E33',
    color: '#FFFFFF',
    border: 'none',
  }),
  streamIcon: (isStreaming: boolean): MantineStyleProp => ({
    backgroundColor: isStreaming ? '#51CF66' : '#2C2E33',
    color: '#FFFFFF',
    border: 'none',
  }),
  settingsIcon: (): MantineStyleProp => ({
    backgroundColor: '#2C2E33',
    color: '#FFFFFF',
    border: 'none',
  }),
  disconnectIcon: (): MantineStyleProp => ({
    backgroundColor: '#2C2E33',
    color: '#FA5252',
    border: 'none',
  }),
};
