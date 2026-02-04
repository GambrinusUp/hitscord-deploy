import { Badge, Box } from '@mantine/core';
import { memo } from 'react';

import { stylesStreamPreview } from './StreamPreview.style';

interface CameraPreviewProps {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  cameraStreamRef?: React.MutableRefObject<MediaStream | null>;
}

export const CameraPreview = memo(({ videoRef }: CameraPreviewProps) => (
  <Box style={stylesStreamPreview.container()}>
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      style={stylesStreamPreview.video()}
    />
    <Badge size="sm" variant="light" color="green">
      LIVE
    </Badge>
  </Box>
));

CameraPreview.displayName = 'CameraPreview';
