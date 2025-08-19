import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Map to track online users
const userSocketMap = {};

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "https://chat-appp-ktmw.onrender.com", // frontend URL
    credentials: true,
  },
});

// Helper to get socket id by userId
export const getReceiverSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // 🔥 Listen for newMessage and send to receiver only
  socket.on("newMessage", (data) => {
    const receiverSocketId = getReceiverSocketId(data.receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", data);
    }
  });

  socket.on("disconnect", () => {
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


export { app, server, io };
