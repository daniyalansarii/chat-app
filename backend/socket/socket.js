import { Server } from "socket.io";

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // frontend URL
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      socket.join(userId); // join a private room with userId
      console.log("User connected:", userId);
    }

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
    });
  });

  return io;
};

export default initSocket;
