import { Box, Button, Slider, Stack } from '@mantine/core';
import { X, Volume2 } from 'lucide-react';

import { stylesStream } from './Stream.style';

import { useMediaContext } from '~/context';

interface StreamProps {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const Stream = ({ videoRef, volume, onVolumeChange }: StreamProps) => {
  const { setSelectedUserId } = useMediaContext();

  const handleCloseStream = () => {
    setSelectedUserId(null);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    onVolumeChange(newVolume);

    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  return (
    <Box style={stylesStream.container()}>
      <video ref={videoRef} autoPlay playsInline style={stylesStream.video()} />
      <Stack style={stylesStream.controls()}>
        <Box style={stylesStream.volumeControl()}>
          <Volume2 size={18} style={{ color: '#fff' }} />
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.01}
            style={stylesStream.volumeSlider()}
            label={(value) => `${Math.round(value * 100)}%`}
          />
        </Box>
        <Button
          variant="filled"
          color="red"
          onClick={handleCloseStream}
          style={stylesStream.button()}
        >
          <X size={20} /> Закрыть
        </Button>
      </Stack>
    </Box>
  );
};
