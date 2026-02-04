export interface UserItemProps {
  socketId: string;
  isSpeaking: boolean;
  userName: string;
  producerIds: string[];
  userVolume: number;
  handleOpenStream: (socketId: string) => void;
  handleVolumeChange: (socketId: string, value: number) => void;
  handleKickUser: (socketId: string) => void;
  handleMuteUser: (userId: string, isMuted: boolean | undefined) => void;
  channelId: string;
  userId?: string;
}
