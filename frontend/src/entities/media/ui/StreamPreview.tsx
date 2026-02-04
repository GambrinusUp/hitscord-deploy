import { Badge, Box } from '@mantine/core';
import { memo } from 'react';

import { stylesStreamPreview } from './StreamPreview.style';

interface StreamPreviewProps {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
}

export const StreamPreview = memo(({ videoRef }: StreamPreviewProps) => {
  return (
    <Box style={stylesStreamPreview.container()}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={stylesStreamPreview.video()}
      />
      <Badge
        size="sm"
        variant="light"
        color="green"
        style={stylesStreamPreview.badge()}
      >
        LIVE
      </Badge>
    </Box>
  );
});

StreamPreview.displayName = 'StreamPreview';
