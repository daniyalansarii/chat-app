import { Server } from "socket.io";

let io;

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
      // ✅ Join room named by userId
      socket.join(userId);
      console.log(`🔌 User connected: ${userId} | Socket ID: ${socket.id}`);

      // ✅ Broadcast online users (optional)
      const onlineUserIds = Array.from(io.sockets.adapter.rooms.keys()).filter(
        (room) => io.sockets.adapter.rooms.get(room)?.has(room) === false // exclude socket IDs
      );
      io.emit("getOnlineUsers", onlineUserIds);
    }

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${userId} | Socket ID: ${socket.id}`);

      // ✅ Broadcast updated online users
      const onlineUserIds = Array.from(io.sockets.adapter.rooms.keys()).filter(
        (room) => io.sockets.adapter.rooms.get(room)?.has(room) === false
      );
      io.emit("getOnlineUsers", onlineUserIds);
    });
  });
};

export const emitToUser = (userId, event, payload) => {
  if (io) {
    io.to(userId).emit(event, payload);
  }
};

export { io };
