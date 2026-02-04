export interface EditModal {
  isEdit: boolean;
  initialData: string;
  channelId: string;
}

export interface UserInList {
  socketId: string;
  producerId: string;
  userName: string;
  userId?: string;
  source?: string;
}

export interface Room {
  roomName: string;
  users: UserInList[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  REJECTED = 'REJECTED',
}
