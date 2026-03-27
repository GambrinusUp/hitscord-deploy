import { Namespace } from "socket.io";
import { store } from "../store/store";
import { notifyUsersList } from "./notifyUsersList";

export const informConsumers = (
  roomName: string,
  socketId: string,
  id: string,
  currentServerId: string,
  connections: Namespace
) => {
  const roomPeers = store.rooms[roomName]?.peers ?? [];

  roomPeers.forEach((peerSocketId) => {
    if (peerSocketId === socketId) return;

    const peerSocket = store.peers[peerSocketId]?.socket;
    if (peerSocket) {
      peerSocket.emit("new-producer", { producerId: id });
    }
  });

  notifyUsersList(currentServerId, connections);
};
