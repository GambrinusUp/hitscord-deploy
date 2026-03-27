import { RtpCodecCapability } from "mediasoup/node/lib/types";

export const mediaCodecs: RtpCodecCapability[] = [
  {
    kind: "audio",
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
    parameters: {
      useinbandfec: 1,
      usedtx: 1,
      "sprop-maxcapturerate": 16000,
      maxplaybackrate: 16000,
    },
  },
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: {
      "x-google-start-bitrate": 300,
    },
  },
];
