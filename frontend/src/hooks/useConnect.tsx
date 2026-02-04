import { useSound } from 'use-sound';

import { socket } from '~/api/socket';
import {
  useMediaContext,
  createDevice,
  createSendTransport,
  getLocalAudioStream,
  joinRoom,
} from '~/context';
import sound from '~/shared/static/zapsplat_multimedia_alert_prompt_mallet_marimba_success_104792.mp3';
import { MuteStatus } from '~/store/ServerStore';

export const useConnect = () => {
  const {
    setIsConnected,
    setAudioProducer,
    setDevice,
    setProducerTransport,
    addConsumer,
    setIsMuted,
    setIsUserMute,
  } = useMediaContext();
  const [play] = useSound(sound, { volume: 0.35 });

  const connect = async (
    roomName: string,
    userName: string,
    userId: string,
    serverId: string,
    accessToken: string,
  ) => {
    try {
      if (!socket.connected) {
        throw new Error('Socket is not connected');
      }

      const audioTrack = await getLocalAudioStream();

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
        if (audioTrack instanceof MediaStream) {
          audioTrack.getTracks().forEach((track) => {
            track.enabled = false;
          });
        } else {
          (audioTrack as MediaStreamTrack).enabled = false;
        }
      }

      const device = await createDevice(rtpCapabilities);
      setDevice(device);

      const producerTransport = await createSendTransport(
        device,
        audioTrack,
        setAudioProducer,
        addConsumer,
      );

      setProducerTransport(producerTransport);
      setIsMuted(isMuted);
      setIsUserMute(muteStatus === MuteStatus.Muted);

      setIsConnected(true);
      play();
    } catch (error) {
      console.error('Error connecting:', error);
      setIsConnected(false);
    }
  };

  return connect;
};
