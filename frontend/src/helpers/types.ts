interface ProducerData {
  producerId: string;
  source?: string;
}

export interface UserGroup {
  userName: string;
  userId?: string;
  //producerIds: string[];
  producers: ProducerData[];
}

export interface RoomGroup {
  roomName: string;
  users: Record<string, UserGroup>;
}
