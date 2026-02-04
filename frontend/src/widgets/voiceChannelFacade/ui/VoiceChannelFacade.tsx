import { Box } from '@mantine/core';

import { stylesVoiceChannelFacade } from './VoiceChannelFacade.style';

import { useMediaContext } from '~/context';
import { StreamView, VoiceGrid } from '~/features/media';

export const VoiceChannelFacade = () => {
  const { selectedUserId } = useMediaContext();

  console.log(selectedUserId);

  return (
    <Box style={stylesVoiceChannelFacade.container()}>
      {selectedUserId ? <StreamView /> : <VoiceGrid />}
    </Box>
  );
};
