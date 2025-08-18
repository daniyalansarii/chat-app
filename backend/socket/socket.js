// socket/socket.js
import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://chat-appp-ktmw.onrender.com"], // your frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// userId -> socketId
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) =>
  userSocketMap[receiverId?.toString()];

io.on("connection", (socket) => {
  const userId = socket.handshake?.query?.userId?.toString();
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
