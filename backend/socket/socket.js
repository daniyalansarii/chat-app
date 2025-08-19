import { Server } from "socket.io";

let io;
const onlineUsers = new Map(); // userId => socketId

export const initSocket = (server, frontendUrl) => {
  io = new Server(server, {
    cors: {
      origin: frontendUrl,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      onlineUsers.set(userId, socket.id);
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    }

    socket.on("disconnect", () => {
      if (userId) {
        onlineUsers.delete(userId);
        io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
      }
    });
  });
};

export const getReceiverSocketId = (userId) => {
  return onlineUsers.get(userId);
};

export { io };
