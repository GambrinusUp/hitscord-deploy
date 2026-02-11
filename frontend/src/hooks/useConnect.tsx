import { useSound } from 'use-sound';

import { socket } from '~/api/socket';
import {
  useMediaContext,
  createDevice,
  createSendTransport,
  getLocalAudioStream,
  joinRoom,
  type MicAudioState,
} from '~/context';
import sound from '~/shared/static/zapsplat_multimedia_alert_prompt_mallet_marimba_success_104792.mp3';
import { MuteStatus } from '~/store/ServerStore';

export const useConnect = () => {
  const {
    setIsConnected,
    setAudioProducer,
    setDevice,
    setProducerTransport,
    consumerTransport,
    setConsumerTransport,
    addConsumer,
    setIsMuted,
    setIsUserMute,
    micSettings,
    setMicAudioState,
  } = useMediaContext();
  const [play] = useSound(sound, { volume: 0.35 });

  const connect = async (
    roomName: string,
    userName: string,
    userId: string,
    serverId: string,
    accessToken: string,
  ) => {
    let micAudioState: MicAudioState | null = null;

    try {
      if (!socket.connected) {
        throw new Error('Socket is not connected');
      }

      micAudioState = await getLocalAudioStream(micSettings);
      const audioTrack = micAudioState.processedTrack;

      const { rtpCapabilities, muteStatus } = await joinRoom(
        roomName,
        userName,
        userId,
        serverId,
        accessToken,
      );

      const isMuted =
        muteStatus === MuteStatus.SelfMuted || muteStatus === MuteStatus.Muted;

      if (isMuted) {
        audioTrack.enabled = false;
      }

      const device = await createDevice(rtpCapabilities);
      setDevice(device);

      const producerTransport = await createSendTransport(
        device,
        audioTrack,
        setAudioProducer,
        addConsumer,
        consumerTransport,
        setConsumerTransport,
      );

      setProducerTransport(producerTransport);
      setIsMuted(isMuted);
      setIsUserMute(muteStatus === MuteStatus.Muted);
      setMicAudioState(micAudioState);

      setIsConnected(true);
      play();
    } catch (error) {
      console.error('Error connecting:', error);
      setIsConnected(false);

      if (micAudioState) {
        micAudioState.processedTrack.stop();
        micAudioState.rawTrack.stop();
        micAudioState.audioContext.close().catch(() => undefined);
      }
      setMicAudioState(null);
    }
  };

  return connect;
};
