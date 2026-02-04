import { AppData, Consumer } from 'mediasoup-client/lib/types';
import { useEffect, useRef } from 'react';

interface UseCameraParams {
  consumers: Consumer<AppData>[];
  userProducerIds: string[];
}

export const useCamera = ({ consumers, userProducerIds }: UseCameraParams) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const consumer = consumers.find(
      (c) =>
        c.kind === 'video' &&
        c.appData?.source === 'camera' &&
        userProducerIds.includes(c.producerId),
    );

    if (!consumer?.track || consumer.track.readyState === 'ended') {
      streamRef.current = null;

      if (videoRef.current) videoRef.current.srcObject = null;

      return;
    }

    if (!streamRef.current) {
      streamRef.current = new MediaStream([consumer.track]);
    }

    const videoEl = videoRef.current;

    if (videoEl && videoEl.srcObject !== streamRef.current) {
      videoEl.srcObject = streamRef.current;
      videoEl.play().catch(() => {});
    }
  }, [consumers, userProducerIds]);

  return { videoRef, streamRef };
};
