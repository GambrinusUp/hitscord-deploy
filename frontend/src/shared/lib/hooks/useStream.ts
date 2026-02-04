import { AppData, Consumer } from 'mediasoup-client/lib/types';
import { useEffect, useRef } from 'react';

interface UseStreamParams {
  isStreaming: boolean;
  consumers: Consumer<AppData>[];
  userProducerIds: string[];
  isPreviewActive?: boolean;
  volume?: number;
}

export const useStream = ({
  isStreaming,
  consumers,
  userProducerIds,
  isPreviewActive = true,
  volume = 1,
}: UseStreamParams) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);
  const previousTracksRef = useRef<string>('');

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  useEffect(() => {
    if (
      !isStreaming ||
      consumers.length === 0 ||
      userProducerIds.length === 0
    ) {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      previousTracksRef.current = '';

      return;
    }

    if (!isPreviewActive) {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      previousTracksRef.current = '';

      return;
    }

    const videoConsumer = consumers.find(
      (consumer) =>
        consumer.kind === 'video' &&
        consumer.appData?.source === 'screen-video' &&
        userProducerIds.includes(consumer.producerId),
    );

    const audioConsumer = consumers.find(
      (consumer) =>
        consumer.kind === 'audio' &&
        consumer.appData?.source === 'screen-audio' &&
        userProducerIds.includes(consumer.producerId),
    );

    const tracks: MediaStreamTrack[] = [];

    if (videoConsumer?.track) tracks.push(videoConsumer.track);

    if (audioConsumer?.track) tracks.push(audioConsumer.track);

    if (tracks.length > 0) {
      const tracksKey = tracks.map((t) => t.id).join(',');

      if (previousTracksRef.current !== tracksKey) {
        previousTracksRef.current = tracksKey;

        const newStream = new MediaStream(tracks);
        previewStreamRef.current = newStream;

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current
            .play()
            .catch((err) =>
              console.error('Ошибка воспроизведения потока:', err),
            );
        }
      }
    } else {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      previousTracksRef.current = '';
    }
  }, [isStreaming, isPreviewActive, consumers, userProducerIds]);

  return { videoRef, previewStreamRef };
};
