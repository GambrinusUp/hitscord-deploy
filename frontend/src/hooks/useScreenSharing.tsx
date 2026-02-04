import { useRef } from 'react';

import { socket } from '~/api';
import { useMediaContext } from '~/context';

export const useScreenSharing = () => {
  const {
    videoProducer,
    setVideoProducer,
    producerTransport,
    setIsStreaming,
    videoAudioProducer,
    setVideoAudioProducer,
  } = useMediaContext();
  const producerIdRef = useRef<string | null>(null);
  const audioProducerIdRef = useRef<string | null>(null);

  const startScreenSharing = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    const screenTrack = screenStream.getVideoTracks()[0];
    const videoProducer = await producerTransport!.produce({
      track: screenTrack,
      appData: { source: 'screen-video' },
    });

    setVideoProducer(videoProducer);
    producerIdRef.current = videoProducer.id;
    videoProducer.on('trackended', stopScreenSharing);

    const audioTrack = screenStream.getAudioTracks()[0];

    if (audioTrack) {
      const audioProducer = await producerTransport!.produce({
        track: audioTrack,
        appData: { source: 'screen-audio' },
      });
      setVideoAudioProducer(audioProducer);
      audioProducerIdRef.current = audioProducer.id;
      audioProducer.on('trackended', stopScreenSharing);
    }

    setIsStreaming(true);
  };

  const stopScreenSharing = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (videoProducer) {
      videoProducer.close();
      socket.emit('stopProducer', {
        producerId: videoProducer!.id,
        accessToken,
      });
    } else {
      socket.emit('stopProducer', {
        producerId: producerIdRef.current,
        accessToken,
      });
    }

    if (videoAudioProducer) {
      videoAudioProducer.close();
      socket.emit('stopProducer', {
        producerId: videoAudioProducer!.id,
        accessToken,
      });
    } else {
      socket.emit('stopProducer', {
        producerId: audioProducerIdRef.current,
        accessToken,
      });
    }

    producerIdRef.current = null;
    audioProducerIdRef.current = null;
    setVideoProducer(null);
    setVideoAudioProducer(null);
    setIsStreaming(false);
  };

  return { startScreenSharing, stopScreenSharing };
};
