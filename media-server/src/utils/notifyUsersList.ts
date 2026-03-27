import { Namespace } from "socket.io";
import { store } from "../store/store";

export const notifyUsersList = (serverId: string, connections: Namespace) => {
  const server = store.servers[serverId];
  const serverUsers = store.serversUser[serverId];

  if (!server || !serverUsers) return;

  const roomUsersList = server.roomNames.map((roomName) => {
    const room = store.rooms[roomName];
    const roomPeers = room?.peers ?? [];

    const producersInRoom = store.producers.filter(
      ({ roomName: producerRoomName }) => producerRoomName === roomName,
    );

    const producersBySocketId = producersInRoom.reduce((acc, producerInfo) => {
      const list = acc.get(producerInfo.socketId);
      if (list) {
        list.push(producerInfo);
      } else {
        acc.set(producerInfo.socketId, [producerInfo]);
      }
      return acc;
    }, new Map<string, typeof producersInRoom>());

    const users = roomPeers.flatMap((socketId) => {
      const peerInfo = store.peers[socketId];
      const peerName = peerInfo?.peerDetails?.name ?? "Unknown";
      const peerUserId = peerInfo?.peerDetails?.userId;
      const peerProducers = producersBySocketId.get(socketId);

      if (!peerProducers || peerProducers.length === 0) {
        return [
          {
            socketId,
            userName: peerName,
            userId: peerUserId,
          },
        ];
      }

      return peerProducers.map(({ producer, source }) => ({
        socketId,
        userName: peerName,
        userId: peerUserId,
        producerId: producer.id,
        source,
      }));
    });

    return {
      roomName,
      users,
    };
  });

  serverUsers.users.forEach((user) => {
    const targetSocket = connections.sockets.get(user.socketId);
    if (targetSocket) {
      targetSocket.emit("updateUsersList", { rooms: roomUsersList });
    }
  });
};
