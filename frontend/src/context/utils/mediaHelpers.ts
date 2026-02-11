import { Device } from 'mediasoup-client';
import { Consumer, ConsumerOptions } from 'mediasoup-client/lib/Consumer';
import { Producer } from 'mediasoup-client/lib/Producer';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { Transport, TransportOptions } from 'mediasoup-client/lib/Transport';
import { Socket } from 'socket.io-client';

import { socket } from '~/api/socket';
import { MuteStatus } from '~/store/ServerStore';

let consumerTransportPromise: Promise<Transport> | null = null;

export const resetConsumerTransportState = () => {
  consumerTransportPromise = null;
};

export type MicSettings = {
  volume: number;
  gainDb: number;
  noiseSuppression: boolean;
  echoCancellation: boolean;
  autoGainControl: boolean;
};

export type MicAudioState = {
  rawTrack: MediaStreamTrack;
  processedTrack: MediaStreamTrack;
  audioContext: AudioContext;
  gainNode: GainNode;
};

export const getDefaultMicSettings = (): MicSettings => ({
  volume: 80,
  gainDb: 0,
  noiseSuppression: true,
  echoCancellation: true,
  autoGainControl: false,
});

export const calculateMicGain = (settings: MicSettings) => {
  const volume = Math.max(0, Math.min(100, settings.volume));
  const gainDb = Math.max(-10, Math.min(20, settings.gainDb));
  const dbGain = Math.pow(10, gainDb / 20);

  return (volume / 100) * dbGain;
};

export const getLocalAudioStream = async (
  settings?: MicSettings,
): Promise<MicAudioState> => {
  const micSettings = settings ?? getDefaultMicSettings();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      noiseSuppression: micSettings.noiseSuppression,
      echoCancellation: micSettings.echoCancellation,
      autoGainControl: micSettings.autoGainControl,
    },
  });

  const rawTrack = stream.getAudioTracks()[0];
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const gainNode = audioContext.createGain();
  const destination = audioContext.createMediaStreamDestination();

  gainNode.gain.value = calculateMicGain(micSettings);
  source.connect(gainNode).connect(destination);

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  return {
    rawTrack,
    processedTrack: destination.stream.getAudioTracks()[0],
    audioContext,
    gainNode,
  };
};

export const joinRoom = async (
  roomName: string,
  userName: string,
  userId: string,
  serverId: string,
  accessToken: string,
) => {
  return new Promise<{
    rtpCapabilities: RtpCapabilities;
    muteStatus?: MuteStatus;
  }>((resolve, reject) => {
    socket.emit(
      'joinRoom',
      { roomName, userName, userId, serverId, accessToken },
      (
        response: {
          rtpCapabilities: RtpCapabilities;
          muteStatus?: MuteStatus;
        } & { error?: string },
      ) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      },
    );
  });
};

export const createDevice = async (rtpCapabilities: RtpCapabilities) => {
  const device = new Device();
  await device.load({ routerRtpCapabilities: rtpCapabilities });

  return device;
};

export const createSendTransport = async (
  device: Device,
  audioTrack: MediaStreamTrack,
  setAudioProducer: React.Dispatch<React.SetStateAction<Producer | null>>,
  addConsumer: (consumer: Consumer) => void,
  consumerTransport: Transport | null,
  setConsumerTransport: React.Dispatch<React.SetStateAction<Transport | null>>,
): Promise<Transport> =>
  new Promise((resolve, reject) => {
    socket.emit(
      'createWebRtcTransport',
      { consumer: false },
      async ({ params }: { params: TransportOptions & { error?: string } }) => {
        if (params.error) {
          reject(params.error);

          return;
        }

        const producerTransport = device.createSendTransport(params);

        producerTransport.on('connect', ({ dtlsParameters }, callback) => {
          socket.emit('transport-connect', { dtlsParameters });
          callback();
        });

        producerTransport.on('produce', (parameters, callback) => {
          const accessToken = localStorage.getItem('accessToken');

          socket.emit(
            'transport-produce',
            {
              kind: parameters.kind,
              rtpParameters: parameters.rtpParameters,
              appData: parameters.appData,
              accessToken,
            },
            ({ id }: { id: string }) => {
              callback({ id });
              getProducers(
                socket,
                device,
                addConsumer,
                consumerTransport,
                setConsumerTransport,
              );
            },
          );
        });

        const audioProducer = await producerTransport.produce({
          track: audioTrack,
        });

        setAudioProducer(audioProducer);

        resolve(producerTransport);

        audioProducer.on('trackended', () => {
          setAudioProducer(null);
        });
      },
    );
  });

export const getProducers = (
  socket: Socket,
  device: Device,
  addConsumer: (consumer: Consumer) => void,
  consumerTransport: Transport | null,
  setConsumerTransport: React.Dispatch<React.SetStateAction<Transport | null>>,
) => {
  socket.emit('getProducers', (producerIds: string[]) => {
    producerIds.forEach((remoteProducerId) =>
      signalNewConsumerTransport(
        remoteProducerId,
        device,
        addConsumer,
        consumerTransport,
        setConsumerTransport,
      ),
    );
  });
};

export const signalNewConsumerTransport = async (
  remoteProducerId: string,
  device: Device | null,
  addConsumer: (consumer: Consumer) => void,
  consumerTransport: Transport | null,
  setConsumerTransport: React.Dispatch<React.SetStateAction<Transport | null>>,
) => {
  if (!device) return;

  const activeConsumerTransport = await ensureConsumerTransport(
    device,
    consumerTransport,
    setConsumerTransport,
  );

  connectRecvTransport(
    activeConsumerTransport,
    remoteProducerId,
    activeConsumerTransport.id,
    device,
    addConsumer,
  );
};

const ensureConsumerTransport = async (
  device: Device,
  consumerTransport: Transport | null,
  setConsumerTransport: React.Dispatch<React.SetStateAction<Transport | null>>,
): Promise<Transport> => {
  if (consumerTransport && !consumerTransport.closed) return consumerTransport;

  if (consumerTransportPromise) {
    const pendingTransport = await consumerTransportPromise;

    if (!pendingTransport.closed) return pendingTransport;
  }

  consumerTransportPromise = new Promise((resolve, reject) => {
    socket.emit(
      'createWebRtcTransport',
      { consumer: true },
      async ({ params }: { params: TransportOptions & { error?: string } }) => {
        if (params.error) {
          reject(params.error);

          return;
        }

        const newConsumerTransport = device.createRecvTransport(params);
        newConsumerTransport.on('connect', ({ dtlsParameters }, callback) => {
          socket.emit('transport-recv-connect', {
            dtlsParameters,
            serverConsumerTransportId: params.id,
          });
          callback();
        });

        setConsumerTransport(newConsumerTransport);
        resolve(newConsumerTransport);
      },
    );
  });

  return consumerTransportPromise;
};

const connectRecvTransport = async (
  consumerTransport: Transport,
  remoteProducerId: string,
  serverConsumerTransportId: string,
  device: Device,
  addConsumer: (consumer: Consumer) => void,
) => {
  socket.emit(
    'consume',
    {
      rtpCapabilities: device.rtpCapabilities,
      remoteProducerId,
      serverConsumerTransportId,
    },
    async ({
      params,
    }: {
      params: ConsumerOptions & {
        serverConsumerId: string;
        userName?: string;
        source?: string;
      };
    }) => {
      const { source, ...consumerParams } = params;

      const consumer = await consumerTransport.consume({
        ...consumerParams,
        appData: {
          source,
        },
      });

      //console.log(consumer.appData.source);
      addConsumer(consumer);
      socket.emit('consumer-resume', {
        serverConsumerId: params.serverConsumerId,
      });
    },
  );
};
