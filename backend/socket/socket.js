import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chat-appp-ktmw.onrender.com", // your frontend
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    socket.join(userId); // join private room
    console.log(`User connected: ${userId}`);
  }

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
  });
});

export { app, server, io };
