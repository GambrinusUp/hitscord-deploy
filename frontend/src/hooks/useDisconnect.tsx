import { useSound } from 'use-sound';

import { socket } from '~/api/socket';
import { resetConsumerTransportState, useMediaContext } from '~/context';
import { useAudioSettings } from '~/shared/lib/hooks';
import sound from '~/shared/static/zapsplat_multimedia_alert_prompt_mallet_marimba_warning_or_error_104796.mp3';

export const useDisconnect = () => {
  const {
    setIsConnected,
    setDevice,
    setVideoProducer,
    setConsumers,
    setIsMuted,
    setIsStreaming,
    setAudioProducer,
    setVideoAudioProducer,
    consumerTransport,
    setConsumerTransport,
    clearMicAudioState,
  } = useMediaContext();
  const { volume } = useAudioSettings();
  const [play] = useSound(sound, { volume });

  const disconnect = async (accessToken: string, voiceChannelId: string) => {
    setIsMuted(false);

    await new Promise<void>((resolve) => {
      socket.once('leaveConfirmed', resolve);
      socket.emit('leaveRoom', { accessToken, voiceChannelId });
    });

    setIsConnected(false);
    setDevice(null);
    setConsumers([]);
    setIsStreaming(false);
    setAudioProducer(null);
    setVideoProducer(null);
    setVideoAudioProducer(null);
    consumerTransport?.close();
    setConsumerTransport(null);
    resetConsumerTransportState();
    clearMicAudioState();

    play();
  };

  return disconnect;
};
