import { Tooltip, Box } from '@mantine/core';
import { IconMicrophoneOff } from '@tabler/icons-react';

import { stylesMicrophoneIndicator } from './MicrophoneIndicator.style';

export const MicrophoneIndicator = () => {
  return (
    <Tooltip label="Микрофон выключен" position="top-end">
      <Box style={stylesMicrophoneIndicator.box()}>
        <IconMicrophoneOff
          size={16}
          style={{ color: 'rgba(239, 68, 68, 0.8)' }}
        />
      </Box>
    </Tooltip>
  );
};
